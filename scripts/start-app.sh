#!/bin/bash

echo "🚀 Starting Privacy Meta Application..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "🗄️ Updating database schema..."
npx prisma db push

# Start development server
echo "🌐 Starting development server..."
npm run dev
