# 🚀 Simple Intent Detection + LangChain

## 📋 نظرة عامة

نظام ذكي بسيط يجمع بين **Pattern Matching** لكشف النوايا و **LangChain** للأسئلة المعقدة.

## ✨ الميزات

- 🧠 **Simple Intent Detection**: كشف النوايا عبر أنماط بسيطة
- 🚀 **Smart Routing**: اختيار بين الرد المباشر و LangChain
- 📱 **Multi-Platform**: دعم Website و WhatsApp و Messenger
- 🔐 **Secure**: حماية شاملة للمدخلات

## 🏗️ البنية

```
src/lib/
├── simple-intent-detector.ts  # Intent Detection Engine
├── chat-api.ts               # Chat Processing
└── webhook-verification.ts   # Security
```

## 🚀 التشغيل

### 1. تثبيت Dependencies
```bash
npm install
```

### 2. تشغيل Redis
```bash
docker-compose up redis -d
```

### 3. تشغيل التطبيق
```bash
npm run dev
```

## 🧪 الاختبار

### اختبار Intent Detection
```bash
# تحية
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "مرحبا"}'

# حجز
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "عايز أحجز خدمة"}'

# سؤال معقد
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "كيف تعمل تقنيات الذكاء الاصطناعي؟"}'
```

## 🧠 كيفية العمل

### 1. **Intent Detection**
- فحص الرسالة مقابل أنماط معروفة
- كشف النوايا (تحية، حجز، أسعار، دعم)
- استخراج الكيانات (نوع الخدمة، الأولوية)

### 2. **Smart Routing**
- **رد مباشر**: للرسائل البسيطة
- **LangChain**: للأسئلة المعقدة

### 3. **Entity Extraction**
- نوع الخدمة (ماسنجر، واتساب، تسويق)
- مستوى الأولوية (عاجل، عادي)
- الموقع (مصر، السعودية، الخليج)

## 📱 المنصات المدعومة

| المنصة | الحالة | Endpoint |
|--------|--------|----------|
| Website | ✅ | `/api/rasa/chat` |
| WhatsApp | ✅ | `/api/rasa/webhook` |
| Messenger | ✅ | `/api/rasa/webhook` |

## 🔧 التكوين

```env
# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# WhatsApp/Facebook (اختياري)
WHATSAPP_ACCESS_TOKEN=your_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_token
```

## 📊 أمثلة الاستخدام

### رسالة بسيطة (رد مباشر)
```
المستخدم: "مرحبا"
النظام: "أهلاً وسهلاً! كيف أقدر أساعدك اليوم؟ 😊"
النية: greet (ثقة: 90%)
```

### رسالة حرجة (رد مباشر)
```
المستخدم: "عايز أحجز خدمة"
النظام: "ممتاز! سجلت طلبك للحجز..."
النية: booking_request (ثقة: 95%)
```

### سؤال معقد (LangChain)
```
المستخدم: "كيف تعمل تقنيات الذكاء الاصطناعي؟"
النظام: "أرى إن سؤالك يحتاج تفصيل أكثر..."
النية: general_question (ثقة: 60%)
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة
1. **Redis Connection Error**
   ```bash
   docker-compose up redis -d
   ```

2. **API Error**
   ```bash
   # تحقق من console logs
   npm run dev
   ```

## 📈 المميزات

- **سرعة**: رد فوري للرسائل البسيطة
- **ذكاء**: استخدام LangChain للأسئلة المعقدة
- **مرونة**: سهولة إضافة أنماط جديدة
- **أمان**: حماية شاملة للمدخلات

---

**ملاحظة**: هذا النظام يجمع بين البساطة والذكاء! 🚀
