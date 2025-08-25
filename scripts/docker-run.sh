#!/bin/bash

echo "🐳 Privacy Meta - Docker Setup & Run"
echo "===================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your real credentials before continuing!"
    echo "🔑 Required: ADMIN_EMAIL, ADMIN_PASSWORD, OPENROUTER_API_KEY"
    read -p "Press Enter after editing .env file..."
fi

# Build and run with Docker Compose
echo "🚀 Building and running with Docker Compose..."
docker-compose up --build -d

echo "✅ Application is running!"
echo "🌐 Open http://localhost:3000 in your browser"
echo "🗄️ MySQL is running on localhost:3306"
echo ""
echo "📋 Useful commands:"
echo "  docker-compose logs -f app     # View app logs"
echo "  docker-compose logs -f mysql   # View MySQL logs"
echo "  docker-compose down            # Stop all services"
echo "  docker-compose restart app     # Restart app only"
