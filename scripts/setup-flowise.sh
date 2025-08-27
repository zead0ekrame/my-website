#!/bin/bash

echo "🚀 إعداد Flowise لإيجي أفريكا..."

# التحقق من تشغيل Flowise
echo "📡 التحقق من تشغيل Flowise..."
if ! curl -s http://localhost:3001 > /dev/null; then
    echo "❌ Flowise غير متاح على http://localhost:3001"
    echo "يجب تشغيل Flowise أولاً:"
    echo "docker run -d --name flowise -p 3001:3000 -v \$(pwd)/flowise-data:/home/node/.flowise flowiseai/flowise:latest"
    exit 1
fi

echo "✅ Flowise يعمل!"

# معلومات الاتصال
echo ""
echo "🌐 معلومات الوصول:"
echo "URL: http://localhost:3001"
echo "Username: admin"
echo "Password: admin123"
echo ""

# تعليمات الإعداد
echo "📋 خطوات الإعداد:"
echo "1. افتح http://localhost:3001 في المتصفح"
echo "2. سجل دخول بـ admin/admin123"
echo "3. أنشئ Chatflow جديد"
echo "4. أضف LLM Chain مع OpenRouter"
echo "5. أضف Prompt Template للعربية"
echo "6. انشر Chatflow واحصل على ID"
echo "7. عدل chatflowId في src/app/page.tsx"
echo ""

# اختبار API
echo "🧪 اختبار Flowise API..."
if curl -s -X POST http://localhost:3001/api/v1/prediction/test -H "Content-Type: application/json" -d '{"question":"مرحبا"}' > /dev/null 2>&1; then
    echo "✅ Flowise API يعمل!"
else
    echo "⚠️ Flowise API قد يحتاج إعداد Chatflow أولاً"
fi

echo ""
echo "🎯 بعد إنشاء Chatflow:"
echo "- عدل chatflowId في FlowiseChat component"
echo "- اختبر الدردشة في الموقع"
echo "- أضف ميزات إضافية مثل RAG أو Memory"
echo ""
echo "🚀 Flowise جاهز للاستخدام!"
