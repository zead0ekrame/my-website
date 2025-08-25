# Privacy Meta - تطبيق الخصوصية الآمن

تطبيق ويب متقدم مع نظام مصادقة آمن وواجهة دردشة ذكية.

## 🚀 المميزات

- ✅ نظام مصادقة آمن مع JWT
- ✅ Rate limiting للحماية من الهجمات
- ✅ Validation للبيانات المدخلة
- ✅ Logging للأمان
- ✅ قاعدة بيانات MySQL آمنة
- ✅ واجهة دردشة مع AI

## 🔒 التحسينات الأمنية

- تم إصلاح ثغرة الكوكي الثابتة
- إضافة Rate Limiting (100 طلب/دقيقة)
- Validation للبيانات المدخلة
- Logging للمحاولات المشبوهة
- حماية أفضل لصفحات الأدمن

## 🛠️ التثبيت

### 1. تثبيت MySQL
```bash
chmod +x scripts/setup-mysql.sh
./scripts/setup-mysql.sh
```

### 2. إعداد المتغيرات البيئية
```bash
cp env.example .env
# عدل .env بالمعلومات الصحيحة
```

### 3. تشغيل التطبيق
```bash
chmod +x scripts/start-app.sh
./scripts/start-app.sh
```

## 📝 المتغيرات البيئية المطلوبة

```env
ADMIN_EMAIL=your-real-admin@email.com
ADMIN_PASSWORD=your-super-strong-password
DATABASE_URL="mysql://username:password@localhost:3306/privacy_meta"
OPENROUTER_API_KEY=your_api_key
```

## 🚨 ملاحظات أمنية

- **لا تستخدم كلمات مرور ضعيفة**
- **غير JWT_SECRET في الإنتاج**
- **استخدم HTTPS في الإنتاج**
- **راقب الـ logs بانتظام**

## 📊 قاعدة البيانات

- MySQL بدلاً من SQLite
- نماذج محسنة للأمان
- فهارس للسرعة
- علاقات آمنة

## 🔧 التطوير

```bash
npm run dev      # تشغيل التطوير
npm run build    # بناء الإنتاج
npm run start    # تشغيل الإنتاج
npm run lint     # فحص الكود
```
