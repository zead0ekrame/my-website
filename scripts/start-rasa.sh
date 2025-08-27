#!/bin/bash

echo "🚀 بدء تشغيل Rasa + LangChain Integration..."

# التحقق من وجود Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 غير مثبت. يرجى تثبيت Python 3.8+"
    exit 1
fi

# التحقق من وجود pip
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 غير مثبت. يرجى تثبيت pip"
    exit 1
fi

# الانتقال إلى مجلد Rasa
cd rasa

# تثبيت dependencies
echo "📦 تثبيت Python dependencies..."
pip3 install -r requirements.txt

# تدريب Rasa
echo "🧠 تدريب Rasa model..."
rasa train

# تشغيل Actions Server في الخلفية
echo "⚡ تشغيل Rasa Actions Server..."
rasa run actions &
ACTIONS_PID=$!

# انتظار قليل
sleep 3

# تشغيل Rasa Server
echo "🌐 تشغيل Rasa Server..."
rasa run --enable-api --cors "*" --port 5005

# تنظيف عند الإغلاق
trap "echo '🛑 إيقاف Rasa...'; kill $ACTIONS_PID; exit" INT TERM
wait
