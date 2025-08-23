#!/bin/bash

# سكريبت إعداد مشروع إيجي إفريقيا للمقاولات
# My Website Setup Script

echo "🚀 بدء إعداد مشروع إيجي إفريقيا للمقاولات..."

# التحقق من وجود Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت. يرجى تثبيته أولاً."
    echo "📖 راجع ملف INSTALLATION.md للتعليمات"
    exit 1
fi

# التحقق من إصدار Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ مطلوب. الإصدار الحالي: $(node -v)"
    echo "📖 راجع ملف INSTALLATION.md للتعليمات"
    exit 1
fi

echo "✅ Node.js مثبت: $(node -v)"

# التحقق من وجود npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm غير مثبت. يرجى تثبيته أولاً."
    exit 1
fi

echo "✅ npm مثبت: $(npm -v)"

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ تم تثبيت التبعيات بنجاح"
else
    echo "❌ فشل في تثبيت التبعيات"
    exit 1
fi

# إنشاء ملف .env
if [ ! -f .env ]; then
    echo "🔧 إنشاء ملف .env..."
    cp env.example .env
    echo "✅ تم إنشاء ملف .env"
    echo "⚠️  يرجى تحديث ملف .env بالمعلومات المطلوبة"
else
    echo "✅ ملف .env موجود بالفعل"
fi

# التحقق من الملفات المطلوبة
echo "🔍 التحقق من الملفات المطلوبة..."

REQUIRED_FILES=(
    "src/lib/constants.ts"
    "src/app/page.tsx"
    "src/components/Navbar.tsx"
    "tailwind.config.js"
    "next.config.js"
    "package.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file مفقود"
    fi
done

echo ""
echo "🎉 تم إعداد المشروع بنجاح!"
echo ""
echo "📋 الخطوات التالية:"
echo "1. قم بتحديث ملف .env بالمعلومات المطلوبة"
echo "2. حدث src/lib/constants.ts بـ App ID و Page ID"
echo "3. شغل المشروع: npm run dev"
echo ""
echo "📖 للمزيد من المعلومات، راجع:"
echo "   - README.md"
echo "   - INSTALLATION.md"
echo ""
echo "🚀 جاهز للبدء!"
