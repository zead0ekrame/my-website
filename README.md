# 🚀 Privacy Meta - Simple Intent Detection + LangChain

## 📋 نظرة عامة

مشروع متكامل يجمع بين **Next.js** للواجهة الأمامية، **Simple Intent Detection** للذكاء الاصطناعي، و **LangChain** للـ RAG، مع دعم كامل لـ **WhatsApp** و **Facebook Messenger**.

## ✨ الميزات الرئيسية

- 🧠 **Simple Intent Detection**: معالجة ذكية للرسائل والـ Intents بدون تعقيد
- 🚀 **LangChain RAG**: ردود مفصلة على الأسئلة المعقدة
- 📱 **Multi-Platform**: دعم WhatsApp و Facebook Messenger
- 🌐 **Website Chat**: دردشة متكاملة عبر الموقع
- 🔐 **Secure**: نظام مصادقة متقدم وحماية شاملة
- 📊 **Analytics**: تتبع الاستخدام والأداء

## 🏗️ البنية التقنية

```
├── src/                    # Next.js Application
│   ├── app/               # App Router
│   ├── components/        # React Components
│   └── lib/              # Utilities & APIs
│       ├── simple-intent-detector.ts  # Intent Detection
│       ├── chat-api.ts               # Chat Processing
│       └── webhook-verification.ts   # Security
├── prisma/               # Database Schema
└── docker-compose.yml    # Infrastructure
```

## 🚀 التشغيل السريع

### 1. تثبيت Dependencies

```bash
# Node.js dependencies
npm install
```

### 2. تشغيل الخدمات

```bash
# تشغيل Redis
docker-compose up redis -d

# تشغيل Next.js
npm run dev
```

### 3. اختبار النظام

```bash
# اختبار Chat API
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "مرحبا"}'
```

## 🔧 التكوين

انسخ ملف `.env.example` إلى `.env` واملأ المتغيرات:

```env
# Database
DATABASE_URL="mysql://user:pass@localhost:3306/db"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# WhatsApp/Facebook (اختياري)
WHATSAPP_ACCESS_TOKEN=your_token
FACEBOOK_PAGE_ACCESS_TOKEN=your_token
```

## 📱 المنصات المدعومة

| المنصة | الحالة | API Endpoint |
|--------|--------|--------------|
| Website | ✅ | `/api/rasa/chat` |
| WhatsApp | ✅ | `/api/rasa/webhook` |
| Messenger | ✅ | `/api/rasa/webhook` |

## 🧠 كيفية عمل النظام

### Intent Detection
- **Simple Patterns**: كشف النوايا عبر أنماط بسيطة
- **Entity Extraction**: استخراج الكيانات (نوع الخدمة، الأولوية، الموقع)
- **Smart Routing**: اختيار بين الرد المباشر و LangChain

### Actions
- **Direct Responses**: للرسائل البسيطة (تحية، وداع، شكر)
- **LangChain RAG**: للأسئلة المعقدة والعامة
- **Entity Handling**: معالجة الكيانات المستخرجة

## 🐳 Docker

```bash
# تشغيل كامل
docker-compose up -d

# تشغيل Redis فقط
docker-compose up redis -d
```

## 📚 التوثيق

- [Intent Detection Guide](docs/intent-detection.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)

## 🔍 الاختبار

```bash
# اختبار Intent Detection
npm run test:chat

# اختبار API
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "عايز أحجز خدمة"}'
```

## 🚨 استكشاف الأخطاء

### مشاكل شائعة

1. **Redis Connection Error**
   ```bash
   docker-compose up redis -d
   ```

2. **Intent Detection Error**
   ```bash
   # تحقق من console logs
   npm run dev
   ```

3. **API Error**
   ```bash
   # تحقق من Network tab في DevTools
   ```

## 📈 المراقبة والتحليلات

### Intent Metrics
- دقة كشف النوايا
- وقت معالجة الرسائل
- معدل النجاح

### Performance Metrics
- وقت الاستجابة
- استخدام الذاكرة
- عدد الطلبات

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

**ملاحظة**: هذا المشروع يجمع بين البساطة والذكاء لإنشاء تجربة مستخدم استثنائية! 🚀
