# 🤖 Rasa + LangChain Integration

## 📋 نظرة عامة

هذا المشروع يجمع بين **Rasa** للـ Intent Classification والـ **LangChain** للـ RAG (Retrieval-Augmented Generation) لإنشاء بوت ذكي متكامل.

## 🏗️ البنية

```
rasa/
├── actions/
│   ├── __init__.py
│   ├── actions.py          # Custom Actions
│   ├── actions_server.py   # Actions Server
│   └── endpoints.yml
├── data/
│   ├── nlu.yml            # Training Data
│   ├── stories.yml        # Conversation Flows
│   └── rules.yml          # Business Rules
├── config.yml             # Rasa Configuration
├── domain.yml             # Domain Definition
├── endpoints.yml          # External Endpoints
├── credentials.yml        # Platform Credentials
├── requirements.txt       # Python Dependencies
└── Dockerfile            # Container Setup
```

## 🚀 التثبيت والتشغيل

### 1. تثبيت Dependencies

```bash
# تثبيت Python dependencies
cd rasa
pip install -r requirements.txt

# تثبيت Node.js dependencies
npm install
```

### 2. تشغيل Redis

```bash
# تشغيل Redis محلياً
docker run -d -p 6379:6379 redis:7-alpine

# أو استخدام Docker Compose
docker-compose up redis -d
```

### 3. تدريب Rasa

```bash
cd rasa
rasa train
```

### 4. تشغيل Rasa Actions Server

```bash
cd rasa
rasa run actions
```

### 5. تشغيل Rasa Server

```bash
cd rasa
rasa run --enable-api --cors "*" --port 5005
```

### 6. تشغيل Next.js App

```bash
npm run dev
```

## 🔧 التكوين

### متغيرات البيئة

أضف هذه المتغيرات إلى ملف `.env`:

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# LLM & AI
LLM_TIMEOUT=15
DEFAULT_TENANT=default
HF_EMBEDDINGS_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Rasa
RASA_TOKEN=your_rasa_token
RASA_WEBHOOK_URL=http://localhost:5005/webhooks/rest/webhook

# Facebook/WhatsApp
FACEBOOK_PAGE_ACCESS_TOKEN=your_token
FACEBOOK_APP_SECRET=your_secret
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_APP_SECRET=your_secret
WHATSAPP_PHONE_NUMBER_ID=your_id
WEBHOOK_VERIFY_TOKEN=your_verify_token
```

## 🧠 كيفية عمل النظام

### 1. **Router الذكي**
- يفحص الرسالة ويحدد النية
- يختار بين Rasa و LangChain بناءً على:
  - **Rasa**: للرسائل الحرجة (حجز، دفع، دعم عاجل)
  - **LangChain**: للأسئلة المعقدة والعامة

### 2. **Rasa Actions**
- `ActionLangchainRAG`: للأسئلة المعقدة
- `ActionBookingHandler`: لطلبات الحجز
- `ActionPricingHandler`: لاستفسارات الأسعار
- `ActionUrgentSupportHandler`: للدعم العاجل

### 3. **LangChain Integration**
- FAISS vector store للبحث السريع
- HuggingFace embeddings للفهم الدلالي
- Redis cache للبيانات المؤقتة

## 📱 المنصات المدعومة

### 1. **Website Chat**
- `/api/rasa/chat` - للدردشة عبر الموقع

### 2. **WhatsApp Business**
- `/api/rasa/webhook` - webhook للرسائل

### 3. **Facebook Messenger**
- `/api/rasa/webhook` - webhook للرسائل

## 🎯 أمثلة الاستخدام

### رسالة حرجة (Rasa)
```
المستخدم: "عايز أحجز خدمة"
النظام: يستخدم Rasa → ActionBookingHandler
النتيجة: تأكيد الحجز + معلومات التواصل
```

### سؤال معقد (LangChain)
```
المستخدم: "كيف تعمل تقنيات الذكاء الاصطناعي في التسويق؟"
النظام: يستخدم LangChain → RAG search
النتيجة: رد مفصل مع أمثلة
```

## 🔍 التطوير والاختبار

### اختبار Rasa Actions

```bash
cd rasa
rasa shell
```

### اختبار API

```bash
# اختبار Chat API
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "مرحبا"}'
```

### اختبار Webhook

```bash
# اختبار WhatsApp Webhook
curl -X POST http://localhost:3000/api/rasa/webhook \
  -H "Content-Type: application/json" \
  -d '{"object": "whatsapp_business_account", "entry": [...]}'
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

1. **Redis Connection Error**
   - تأكد من تشغيل Redis
   - تحقق من متغيرات البيئة

2. **Rasa Training Error**
   - تحقق من صحة ملفات البيانات
   - تأكد من تثبيت dependencies

3. **Actions Server Error**
   - تأكد من تشغيل Actions Server
   - تحقق من logs

### Logs

```bash
# Rasa logs
cd rasa
rasa run --log-level DEBUG

# Actions Server logs
cd rasa
rasa run actions --log-level DEBUG
```

## 📈 المراقبة والتحليلات

### Redis Metrics
- عدد الطلبات
- وقت الاستجابة
- استخدام الذاكرة

### Rasa Metrics
- دقة Intent Classification
- وقت معالجة الرسائل
- معدل النجاح

## 🔐 الأمان

- **Webhook Verification**: تحقق من صحة الرسائل
- **Rate Limiting**: منع الإساءة
- **Input Sanitization**: تنظيف المدخلات
- **Tenant Isolation**: عزل العملاء

## 🚀 النشر

### Docker

```bash
# بناء الصور
docker-compose build

# تشغيل الخدمات
docker-compose up -d
```

### Production

```bash
# بناء Next.js
npm run build

# تشغيل Production
npm start
```

## 📞 الدعم

للمساعدة التقنية:
- 📧 ziad@ekramy-ai.online
- 📱 +20 106 616 1454
- 🌐 https://ekramy-ai.online

---

**ملاحظة**: هذا المشروع يجمع بين أفضل تقنيات الذكاء الاصطناعي لإنشاء تجربة مستخدم استثنائية! 🚀
