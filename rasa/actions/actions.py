import os
import json
import asyncio
import logging
from typing import Any, Dict, Text
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.events import SlotSet, FollowupAction
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from redis import Redis

# ===== إعدادات عامة =====
LLM_TIMEOUT = int(os.getenv("LLM_TIMEOUT", "15"))
DEFAULT_TENANT = os.getenv("DEFAULT_TENANT", "default")

# ===== إعداد Logging =====
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ===== Embeddings مرة واحدة =====
try:
    _EMB = HuggingFaceEmbeddings(
        model_name=os.getenv("HF_EMBEDDINGS_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
    )
except Exception as e:
    logger.error(f"Error loading embeddings model: {e}")
    _EMB = None

# ===== Redis آمن =====
def get_redis_safely() -> Redis | None:
    try:
        return Redis(
            host=os.getenv("REDIS_HOST", "redis"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            db=int(os.getenv("REDIS_DB", 0)),
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
        )
    except Exception as e:
        logger.error(f"Redis connection error: {e}")
        return None

def _tenant_from_sender(sender: Text) -> Text:
    r = get_redis_safely()
    if r:
        try:
            t = r.get(f"sender:{sender}")
            if t:
                return t
        except Exception as e:
            logger.error(f"Error getting tenant: {e}")
    return DEFAULT_TENANT

# ===== تحقق Tenant أقوى من regex =====
def validate_tenant(tenant: str) -> bool:
    if not tenant or len(tenant) > 50:
        return False
    base = tenant.replace('_','').replace('-','')
    return base.isalnum()

# ===== فهارس آمنة في الذاكرة (بديل عن load_local) =====
_INDEX_CACHE: dict[str, FAISS] = {}

def create_safe_index(tenant: str, documents: list[Document]) -> FAISS:
    if not _EMB:
        logger.error("Embeddings model not loaded")
        return None
    try:
        return FAISS.from_documents(documents, _EMB)
    except Exception as e:
        logger.error(f"Error creating index: {e}")
        return None

# ===== LLM Timeout بأسلوب Async آمن =====
async def _llm_call(llm, prompt: str) -> str:
    return await asyncio.to_thread(lambda: llm.invoke(prompt))

async def call_llm_timeout(llm, prompt: str, timeout: int) -> str:
    try:
        return await asyncio.wait_for(_llm_call(llm, prompt), timeout=timeout)
    except asyncio.TimeoutError:
        return "انتهت مهلة الرد."
    except Exception as e:
        logger.error(f"LLM error: {e}")
        s = str(e).lower()
        if "rate limit" in s:
            return "النظام مشغول، جرب بعد دقيقة."
        if "timeout" in s:
            return "الاستعلام يحتاج وقت أكثر، جرّب تبسيط السؤال."
        return "حدث خطأ مؤقت، جرب مرة أخرى."

# ===== Actions =====

class ActionLangchainRAG(Action):
    def name(self) -> Text:
        return "action_langchain_rag"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]):
        try:
            sender = tracker.sender_id
            tenant = _tenant_from_sender(sender)
            if not validate_tenant(tenant):
                tenant = DEFAULT_TENANT
            
            query = (tracker.latest_message.get("text") or "").strip()
            if not query:
                dispatcher.utter_message(text="من فضلك اكتب سؤالك.")
                return []

            # فهرس آمن لكل تينانت — في الذاكرة
            vs = _INDEX_CACHE.get(tenant)
            if vs is None:
                # TODO: استبدل docs الافتراضية بتحميل آمن من مصدر موثوق للعميل
                docs = [Document(page_content=f"مرحبًا! (Tenant={tenant}) — لا توجد بيانات بعد.")]
                vs = create_safe_index(tenant, docs)
                if vs:
                    _INDEX_CACHE[tenant] = vs

            if not vs:
                dispatcher.utter_message(text="عذراً، النظام غير متاح حالياً. تواصل معنا عبر واتساب: +20 106 616 1454")
                return []

            # البحث في الفهرس
            try:
                top = vs.similarity_search(query, k=3)
                context = "\n".join(d.page_content for d in top)
            except Exception as e:
                logger.error(f"Search error: {e}")
                context = "لا توجد معلومات متاحة حالياً."

            # استخدام LLM (مثال - استبدل بـ LLM الخاص بك)
            try:
                # TODO: استبدل بـ LLM الفعلي
                answer = f"بناءً على سؤالك: {query}\n\nالسياق: {context}\n\nهذا رد تجريبي من Rasa + LangChain integration."
                
                dispatcher.utter_message(text=answer)
            except Exception as e:
                logger.error(f"LLM processing error: {e}")
                dispatcher.utter_message(text="عذراً، حدث خطأ في معالجة سؤالك. تواصل معنا عبر واتساب: +20 106 616 1454")
            
        except Exception as e:
            logger.error(f"Action error: {e}")
            dispatcher.utter_message(text="عذراً، حدث خطأ. تواصل معنا عبر واتساب: +20 106 616 1454")
        
        return []

class ActionBookingHandler(Action):
    def name(self) -> Text:
        return "action_booking_handler"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]):
        try:
            sender = tracker.sender_id
            tenant = _tenant_from_sender(sender)
            
            # تسجيل طلب الحجز
            booking_data = {
                "sender_id": sender,
                "tenant": tenant,
                "timestamp": tracker.latest_message.get("timestamp"),
                "intent": "booking_request"
            }
            
            # حفظ في Redis
            r = get_redis_safely()
            if r:
                try:
                    r.setex(f"booking:{sender}:{tracker.latest_message.get('timestamp')}", 3600, json.dumps(booking_data))
                except Exception as e:
                    logger.error(f"Redis save error: {e}")
            
            dispatcher.utter_message(text="ممتاز! سجلت طلبك للحجز. فريقنا هيوصل لك خلال ساعة 👨‍💼\n\nتواصل معنا عبر واتساب: +20 106 616 1454")
            
        except Exception as e:
            logger.error(f"Booking handler error: {e}")
            dispatcher.utter_message(text="عذراً، حدث خطأ في تسجيل الحجز. تواصل معنا مباشرة عبر واتساب: +20 106 616 1454")
        
        return []

class ActionPricingHandler(Action):
    def name(self) -> Text:
        return "action_pricing_handler"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]):
        try:
            # استخراج معلومات من الرسالة
            message = tracker.latest_message.get("text", "").lower()
            
            pricing_info = "بالنسبة للتكلفة، نحدد أولاً:\n"
            pricing_info += "- نوع الذكاء المطلوب (ردود ثابتة أم LLM)\n"
            pricing_info += "- عدد السيناريوهات/الردود الذكية\n"
            pricing_info += "- التكاملات الإضافية (CRM, Google Sheets, WhatsApp)\n"
            pricing_info += "- الدعم الشهري والمتابعة\n\n"
            pricing_info += "احجز استشارة: /book أو تواصل واتساب: +20 106 616 1454"
            
            dispatcher.utter_message(text=pricing_info)
            
        except Exception as e:
            logger.error(f"Pricing handler error: {e}")
            dispatcher.utter_message(text="عذراً، حدث خطأ. تواصل معنا عبر واتساب: +20 106 616 1454")
        
        return []

class ActionUrgentSupportHandler(Action):
    def name(self) -> Text:
        return "action_urgent_support_handler"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]):
        try:
            sender = tracker.sender_id
            tenant = _tenant_from_sender(sender)
            
            # تسجيل طلب الدعم العاجل
            urgent_data = {
                "sender_id": sender,
                "tenant": tenant,
                "timestamp": tracker.latest_message.get("timestamp"),
                "priority": "urgent",
                "message": tracker.latest_message.get("text")
            }
            
            # حفظ في Redis
            r = get_redis_safely()
            if r:
                try:
                    r.setex(f"urgent:{sender}:{tracker.latest_message.get('timestamp')}", 1800, json.dumps(urgent_data))
                except Exception as e:
                    logger.error(f"Redis save error: {e}")
            
            dispatcher.utter_message(text="فهمت إن الموضوع عاجل! هتواصل معاك فوراً عبر واتساب: +20 106 616 1454 🚨\n\nرقم الواتساب: +20 106 616 1454")
            
        except Exception as e:
            logger.error(f"Urgent support handler error: {e}")
            dispatcher.utter_message(text="عذراً، حدث خطأ. تواصل معنا مباشرة عبر واتساب: +20 106 616 1454")
        
        return []
