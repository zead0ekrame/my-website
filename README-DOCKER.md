# 🐳 Docker Guide - إيجي أفريكا للمقاولات

## 🚀 نظرة عامة

هذا الدليل يوضح كيفية استخدام Docker لتشغيل موقع إيجي أفريكا للمقاولات.

## 📋 المتطلبات

- Docker مثبت على النظام
- 3000 MB مساحة خالية على الأقل
- اتصال بالإنترنت لتحميل الصور

## 🔧 الأوامر الأساسية

### 1. بناء Docker Image
```bash
# بناء الصورة
sudo docker build -t egy-africa-ai .

# أو بدون sudo (إذا كان المستخدم في مجموعة docker)
docker build -t egy-africa-ai .
```

### 2. تشغيل الحاوية
```bash
# تشغيل الحاوية في الخلفية
sudo docker run -d --name egy-africa-app -p 3000:3000 egy-africa-ai

# تشغيل الحاوية بشكل تفاعلي
sudo docker run -it --rm -p 3000:3000 egy-africa-ai
```

### 3. إدارة الحاوية
```bash
# عرض الحاويات العاملة
sudo docker ps

# إيقاف الحاوية
sudo docker stop egy-africa-app

# إعادة تشغيل الحاوية
sudo docker restart egy-africa-app

# حذف الحاوية
sudo docker rm egy-africa-app

# عرض logs الحاوية
sudo docker logs egy-africa-app

# عرض logs بشكل مستمر
sudo docker logs -f egy-africa-app
```

### 4. إدارة الصور
```bash
# عرض الصور المحلية
sudo docker images

# حذف صورة
sudo docker rmi egy-africa-ai

# تنظيف الصور غير المستخدمة
sudo docker image prune -f
```

## 🌐 الوصول للتطبيق

بعد تشغيل الحاوية، يمكنك الوصول للتطبيق على:
- **المحلي:** http://localhost:3000
- **الشبكة:** http://[IP-ADDRESS]:3000

## 🔍 استكشاف الأخطاء

### مشكلة: الحاوية لا تعمل
```bash
# فحص حالة الحاوية
sudo docker ps -a

# عرض logs
sudo docker logs egy-africa-app

# إعادة تشغيل
sudo docker restart egy-africa-app
```

### مشكلة: المنفذ مشغول
```bash
# فحص المنافذ المستخدمة
sudo netstat -tlnp | grep :3000

# إيقاف الحاوية
sudo docker stop egy-africa-app

# تشغيل على منفذ مختلف
sudo docker run -d --name egy-africa-app -p 3001:3000 egy-africa-ai
```

### مشكلة: لا يمكن الوصول للتطبيق
```bash
# اختبار التطبيق
curl -f http://localhost:3000

# فحص logs
sudo docker logs egy-africa-app

# إعادة بناء الصورة
sudo docker build --no-cache -t egy-africa-ai .
```

## 📊 مراقبة الأداء

```bash
# عرض استخدام الموارد
sudo docker stats egy-africa-app

# عرض معلومات مفصلة
sudo docker inspect egy-africa-app
```

## 🧹 التنظيف

```bash
# إيقاف وحذف جميع الحاويات
sudo docker stop $(sudo docker ps -aq)
sudo docker rm $(sudo docker ps -aq)

# حذف جميع الصور
sudo docker rmi $(sudo docker images -q)

# تنظيف شامل
sudo docker system prune -a -f
```

## 🔄 التحديث

```bash
# إيقاف الحاوية القديمة
sudo docker stop egy-africa-app
sudo docker rm egy-africa-app

# إعادة بناء الصورة
sudo docker build -t egy-africa-ai .

# تشغيل الحاوية الجديدة
sudo docker run -d --name egy-africa-app -p 3000:3000 egy-africa-ai
```

## 📝 ملاحظات مهمة

1. **كلمة المرور:** استخدم `zeadzead` عند طلب sudo
2. **المنفذ:** تأكد من أن المنفذ 3000 متاح
3. **المساحة:** تأكد من وجود مساحة كافية على القرص
4. **الإنترنت:** مطلوب للتحميل الأولي

## 🆘 الدعم

- **المالك:** EKRAMY FOUAAD
- **الهاتف:** +20 106 616 1454
- **البريد الإلكتروني:** ziad@ekramy-ai.online

## 🎯 إيجي أفريكا للمقاولات

رائدون في حلول الذكاء الاصطناعي في الوطن العربي 🚀
