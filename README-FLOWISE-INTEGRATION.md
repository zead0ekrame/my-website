# 🚀 Privacy Meta - نظام متكامل مع Flowise

## 📋 نظرة عامة

نظام **Privacy Meta** هو حل متكامل لإنشاء وإدارة chatbots ذكية للمراسلات (WhatsApp, Messenger, Instagram) مع دعم كامل لـ **Flowise** كمنصة backend للذكاء الاصطناعي.

## 🏗️ المعمارية

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   Flowise API   │    │   Database      │
│                 │◄──►│                 │◄──►│   (Prisma)      │
│ • Admin Panel  │    │ • Chatflows     │    │ • Tenants       │
│ • Client Panel │    │ • LLM Models    │    │ • Projects      │
│ • Chat Widget  │    │ • RAG Pipeline  │    │ • Chatflows     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## ✨ المميزات الرئيسية

### 🔐 نظام متعدد المستأجرين (Multi-Tenant)
- **Tenants**: عملاء منفصلون مع بيانات معزولة
- **Projects**: مشاريع متعددة لكل عميل
- **Chatflows**: قوالب chatbot قابلة للتخصيص

### 🤖 Chatbots ذكية
- **Simple Intent Detection**: ردود سريعة للأسئلة البسيطة
- **Flowise Integration**: ذكاء اصطناعي متقدم مع RAG
- **Hybrid Routing**: توجيه ذكي بين الأنظمة

### 📱 دعم منصات متعددة
- **WhatsApp Business API**
- **Facebook Messenger**
- **Instagram Business**
- **Website Chat Widget**

### 📊 لوحات تحكم متقدمة
- **Admin Dashboard**: إدارة شاملة للعملاء والنظام
- **Client Dashboard**: واجهة سهلة للعملاء
- **Analytics**: إحصائيات مفصلة وأداء

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: Node.js + Prisma ORM
- **AI Platform**: Flowise (Self-hosted)
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **State Management**: React Hooks + Context

## 📁 هيكل المشروع

```
privacy-meta/
├── flowise/                    # قوالب Flowise
│   └── chatflows/
│       ├── support-bot.json   # بوت الدعم الفني
│       ├── sales-bot.json     # بوت المبيعات
│       └── faq-bot.json       # بوت الأسئلة الشائعة
├── src/
│   ├── app/
│   │   ├── admin/             # لوحة الإدارة
│   │   ├── client/            # لوحة العميل
│   │   └── api/               # API endpoints
│   ├── components/            # مكونات React
│   └── lib/                   # مكتبات مساعدة
├── prisma/                    # قاعدة البيانات
└── docker-compose.yml         # تكوين Docker
```

## 🚀 التثبيت والإعداد

### 1. متطلبات النظام
- Node.js 18+
- Docker & Docker Compose
- Git

### 2. تثبيت المشروع
```bash
# استنساخ المشروع
git clone <repository-url>
cd privacy-meta

# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
npm run db:push

# تشغيل Flowise
docker-compose up -d flowise

# تشغيل التطبيق
npm run dev
```

### 3. إعداد Flowise
1. افتح `http://localhost:3001`
2. سجل دخول كأول مستخدم
3. استورد قوالب Chatflow من مجلد `flowise/chatflows/`
4. احصل على API Key

### 4. متغيرات البيئة
```env
# Database
DATABASE_URL="file:./dev.db"

# Flowise
FLOWISE_URL="http://localhost:3001"
FLOWISE_API_KEY="your-api-key"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 📚 القوالب المتاحة

### 1. Support Bot Template
- **الوصف**: بوت دعم فني للرد على استفسارات العملاء
- **المميزات**: 
  - كشف النوايا السريع
  - ردود مخصصة
  - دعم متعدد اللغات
- **الاستخدام**: شركات الخدمات، المتاجر الإلكترونية

### 2. Sales Bot Template
- **الوصف**: بوت مبيعات لمساعدة العملاء في اختيار الخدمات
- **المميزات**:
  - عرض الخدمات والأسعار
  - حجز المواعيد
  - إقناع العملاء
- **الاستخدام**: شركات المبيعات، الاستشارات

### 3. FAQ Bot Template
- **الوصف**: بوت الأسئلة الشائعة للرد السريع
- **المميزات**:
  - قاعدة أسئلة شاملة
  - ردود فورية
  - تحديث مستمر
- **الاستخدام**: المواقع الإلكترونية، التطبيقات

## 🔧 API Endpoints

### Admin API
```typescript
// إدارة العملاء
GET    /api/admin/tenants
POST   /api/admin/tenants
PUT    /api/admin/tenants/:id
DELETE /api/admin/tenants/:id

// إحصائيات النظام
GET    /api/admin/analytics
GET    /api/admin/usage
```

### Client API
```typescript
// إدارة المشاريع
GET    /api/client/projects
POST   /api/client/projects
PUT    /api/client/projects/:id

// Chat API
POST   /api/client/chat
GET    /api/client/conversations
```

### Flowise Integration
```typescript
// معالجة الرسائل
POST   /api/flowise/chat/:chatflowId

// إدارة Chatflows
GET    /api/flowise/chatflows
POST   /api/flowise/chatflows
```

## 🎯 كيفية الاستخدام

### 1. إنشاء عميل جديد
1. ادخل للوحة الإدارة
2. اضغط "إضافة عميل جديد"
3. أدخل بيانات العميل
4. اختر الخطة المناسبة

### 2. إنشاء مشروع
1. ادخل للوحة العميل
2. اضغط "مشروع جديد"
3. اختر نوع القالب
4. اضبط الإعدادات

### 3. تخصيص Chatbot
1. افتح المشروع
2. عدل البرومبتات
3. أضف ملفات المعرفة
4. اختبر البوت

### 4. ربط المنصات
1. اربط حساب WhatsApp Business
2. اربط صفحة Facebook
3. اربط حساب Instagram
4. اختبر التكامل

## 📊 مراقبة الأداء

### Admin Analytics
- عدد العملاء النشطين
- إجمالي المشاريع
- الإيرادات الشهرية
- استخدام الموارد

### Client Analytics
- عدد المحادثات
- معدل الرضا
- زمن الاستجابة
- مصادر المعرفة المستخدمة

## 🔒 الأمان

### Multi-Tenancy
- عزل البيانات بين العملاء
- صلاحيات محددة لكل مستخدم
- تشفير البيانات الحساسة

### API Security
- JWT Authentication
- Rate Limiting
- Input Validation
- SQL Injection Protection

## 🚀 النشر

### Docker Deployment
```bash
# بناء الصورة
docker build -t privacy-meta .

# تشغيل الحاويات
docker-compose up -d
```

### Production Setup
1. استخدم PostgreSQL بدلاً من SQLite
2. اضبط Redis للـ caching
3. استخدم S3/R2 لتخزين الملفات
4. اضبط HTTPS و SSL

## 🐛 استكشاف الأخطاء

### مشاكل شائعة
1. **Flowise لا يعمل**: تحقق من Docker containers
2. **خطأ في قاعدة البيانات**: أعد تشغيل Prisma
3. **مشاكل في API**: تحقق من متغيرات البيئة

### Logs
```bash
# Flowise logs
docker-compose logs flowise

# Application logs
npm run dev
```

## 📈 التطوير المستقبلي

### المرحلة القادمة
- [ ] دعم Telegram Bot
- [ ] تكامل مع CRM systems
- [ ] دعم اللغات الإضافية
- [ ] تحليلات متقدمة

### التحسينات المقترحة
- [ ] Machine Learning للكشف عن النوايا
- [ ] دعم الصوت والفيديو
- [ ] تكامل مع أدوات التسويق
- [ ] نظام التنبيهات

## 🤝 المساهمة

نرحب بمساهماتكم! يرجى:
1. Fork المشروع
2. إنشاء branch جديد
3. إجراء التغييرات
4. إرسال Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## 📞 الدعم

للحصول على الدعم:
- 📧 Email: support@privacy-meta.com
- 📱 WhatsApp: +20 123 456 789
- 🌐 Website: www.privacy-meta.com

---

**Privacy Meta** - حلول chatbot ذكية للمراسلات 🚀

