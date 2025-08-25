#!/bin/bash

echo "🚀 Privacy Meta - Complete Setup & Run"
echo "======================================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Don't run as root! Use: sudo ./scripts/run-all.sh"
    exit 1
fi

# Setup MySQL
echo "🗄️ Setting up MySQL..."
chmod +x scripts/setup-mysql.sh
./scripts/setup-mysql.sh

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Updating database schema..."
npx prisma db push

# Start application
echo "🌐 Starting application..."
npm run dev
