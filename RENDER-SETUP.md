# إعداد المشروع على Render 🚀

## المتطلبات الأساسية:
1. حساب على [Render.com](https://render.com)
2. قاعدة بيانات MySQL (يمكن إنشاؤها على Render)

## خطوات النشر:

### 1. إنشاء قاعدة بيانات MySQL على Render:
- اذهب إلى Render Dashboard
- اختر "New" → "PostgreSQL" أو "MySQL"
- اختر الخطة المناسبة
- احفظ معلومات الاتصال

### 2. إنشاء Web Service:
- اذهب إلى Render Dashboard
- اختر "New" → "Web Service"
- اربط repository GitHub الخاص بك
- اختر الفرع (branch) المطلوب

### 3. تعيين متغيرات البيئة:
في Render Dashboard، أضف المتغيرات التالية:

```bash
# قاعدة البيانات (مطلوب)
DATABASE_URL=mysql://username:password@host:port/database_name

# LLM & AI (مطلوب)
OPENROUTER_API_KEY=your_api_key_here
OPENROUTER_MODEL=qwen/qwen2.5-vl-32b-instruct:free
LLM_TEMPERATURE=0.4

# بيانات الأدمن (مطلوب)
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-strong-password

# JWT (مطلوب)
JWT_SECRET=your-super-secret-jwt-key-32-characters

# عنوان الموقع (مطلوب)
NEXT_PUBLIC_SITE_URL=https://your-app-name.onrender.com

# Redis (اختياري)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_DB=0

# Flowise (اختياري)
FLOWISE_USERNAME=admin
FLOWISE_PASSWORD=admin123
FLOWISE_URL=https://your-flowise-app.onrender.com
```

### 4. إعدادات البناء:
- **Build Command**: `npm ci && npx prisma generate && npm run build`
- **Start Command**: `npm start`

### 5. قاعدة البيانات:
بعد أول نشر، قم بتشغيل:
```bash
npx prisma db push
```

## ملاحظات مهمة:
- ✅ المشروع جاهز للـ MySQL
- ✅ Prisma schema محدث
- ✅ Dependencies موجودة
- ✅ render.yaml جاهز

## استكشاف الأخطاء:
إذا واجهت مشاكل:
1. تحقق من `DATABASE_URL`
2. تأكد من أن قاعدة البيانات تعمل
3. راجع logs في Render Dashboard
