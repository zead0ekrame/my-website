# 🚀 Flowise + إيجي أفريكا

## 📋 نظرة عامة

نظام دردشة ذكي متكامل يجمع بين **Flowise** للواجهات الجميلة و **LangChain** للذكاء الاصطناعي.

## ✨ المميزات

- 🎨 **واجهات جاهزة** جميلة ومتجاوبة
- 🧠 **LangChain Integration** للذكاء الاصطناعي
- 📱 **Multi-Platform** دعم كامل
- 🔐 **أمان متقدم** مع webhook verification
- 🌍 **دعم العربية** كامل

## 🚀 التشغيل السريع

### 1. تشغيل Flowise
```bash
docker run -d --name flowise -p 3001:3000 \
  -v $(pwd)/flowise-data:/home/node/.flowise \
  flowiseai/flowise:latest
```

### 2. تشغيل التطبيق
```bash
npm run dev
```

### 3. إعداد Flowise
```bash
./scripts/setup-flowise.sh
```

## 🌐 الوصول

- **Flowise**: http://localhost:3001
- **الموقع**: http://localhost:3000
- **Credentials**: admin/admin123

## 🏗️ البنية

```
├── src/components/FlowiseChat.tsx    # واجهة الدردشة الجميلة
├── scripts/setup-flowise.sh          # إعداد Flowise
└── flowise-data/                     # بيانات Flowise
```

## 📱 الواجهات المتاحة

- **Modern Chat Widget** - جميل ومتجاوب
- **Floating Chat Button** - أنيق
- **Full-screen Chat** - احترافي
- **Mobile-optimized** - متوافق مع الموبايل

## 🎨 التخصيص

- ألوان الشركة (primaryColor)
- شعار إيجي أفريكا
- رسائل مخصصة
- تصميم عربي

## 🔧 الإعداد

### 1. إنشاء Chatflow
1. افتح http://localhost:3001
2. سجل دخول بـ admin/admin123
3. أنشئ Chatflow جديد
4. أضف LLM Chain مع OpenRouter
5. أضف Prompt Template للعربية
6. انشر Chatflow واحصل على ID

### 2. ربط مع الموقع
```tsx
<FlowiseChat 
  flowiseUrl="http://localhost:3001"
  chatflowId="your-chatflow-id"
  primaryColor="#2296f3"
  placeholder="اكتب رسالتك هنا..."
/>
```

## 🧪 الاختبار

```bash
# اختبار Flowise
curl -X POST http://localhost:3001/api/v1/prediction/test \
  -H "Content-Type: application/json" \
  -d '{"question":"مرحبا"}'

# اختبار الموقع
curl -X POST http://localhost:3000/api/rasa/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"مرحبا"}'
```

## 📈 المميزات المتقدمة

- **RAG Integration** - استرجاع المعلومات
- **Memory Management** - تذكر المحادثات
- **Multi-Modal** - دعم الصور والنصوص
- **Analytics** - تتبع الاستخدام

## 🚨 استكشاف الأخطاء

### Flowise لا يعمل
```bash
docker logs flowise
docker restart flowise
```

### API لا يستجيب
```bash
# تحقق من Chatflow ID
# تحقق من OpenRouter API Key
# تحقق من Network tab
```

## 🎯 الخطوات التالية

1. **إنشاء Chatflow** في Flowise
2. **ربط مع OpenRouter** 
3. **تخصيص الواجهة** للشركة
4. **إضافة ميزات متقدمة** (RAG, Memory)
5. **ربط WhatsApp/Messenger**

---

**ملاحظة**: هذا النظام يجمع بين الجمال والذكاء! 🚀✨
