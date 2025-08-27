#!/bin/bash

echo "🧪 اختبار Rasa + LangChain Integration..."

# اختبار Rasa Server
echo "📡 اختبار Rasa Server..."
if curl -s http://localhost:5005/status > /dev/null; then
    echo "✅ Rasa Server يعمل"
else
    echo "❌ Rasa Server لا يعمل"
fi

# اختبار Actions Server
echo "⚡ اختبار Actions Server..."
if curl -s http://localhost:5055/health > /dev/null; then
    echo "✅ Actions Server يعمل"
else
    echo "❌ Actions Server لا يعمل"
fi

# اختبار Redis
echo "🔴 اختبار Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis يعمل"
else
    echo "❌ Redis لا يعمل"
fi

# اختبار Next.js API
echo "🌐 اختبار Next.js API..."
if curl -s http://localhost:3000/api/rasa/chat > /dev/null; then
    echo "✅ Next.js API يعمل"
else
    echo "❌ Next.js API لا يعمل"
fi

echo "🎯 انتهى الاختبار!"
