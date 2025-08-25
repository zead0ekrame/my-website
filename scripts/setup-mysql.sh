#!/bin/bash

echo "🚀 Setting up MySQL for Privacy Meta..."

# Update system
echo "📦 Updating system packages..."
sudo apt update

# Install MySQL
echo "🗄️ Installing MySQL Server..."
sudo apt install mysql-server -y

# Start MySQL service
echo "▶️ Starting MySQL service..."
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure MySQL installation
echo "🔒 Securing MySQL installation..."
sudo mysql_secure_installation

# Create database
echo "🏗️ Creating database..."
sudo mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS privacy_meta;"

echo "✅ MySQL setup complete!"
echo "📝 Don't forget to update your .env file with the correct DATABASE_URL"
echo "🔑 Example: DATABASE_URL=\"mysql://username:password@localhost:3306/privacy_meta\""
