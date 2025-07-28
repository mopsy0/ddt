#!/bin/bash

# Wonder Dating App Setup Script
# This script helps set up the development environment

echo "🚀 Setting up Wonder Dating App..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if MongoDB is running (optional, can use Atlas)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed locally. You can use MongoDB Atlas instead."
fi

echo "✅ Prerequisites check completed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd src/python
pip3 install -r requirements.txt
cd ../..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your actual configuration values"
fi

cd ..

# Install frontend dependencies
echo "📱 Installing frontend dependencies..."
npm install

# Install Expo CLI if not present
if ! command -v expo &> /dev/null; then
    echo "🔧 Installing Expo CLI..."
    npm install -g @expo/cli
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your configuration (MongoDB, OpenAI, Cloudinary, etc.)"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. Start the frontend: npm start"
echo ""
echo "📚 Check README.md for detailed setup instructions"
echo "🐛 If you encounter issues, check the troubleshooting section in README.md"
echo ""
echo "Happy coding! 💕"