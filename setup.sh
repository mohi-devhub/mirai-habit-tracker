#!/bin/bash

# Mirai - Adaptive Micro-Habit App Setup Script
echo "🚀 Setting up Mirai - Adaptive Micro-Habit App..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed. Please install Node.js 16+ and try again."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is required but not installed. Please install PostgreSQL and try again."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Backend Setup
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Create .env file
echo "⚙️ Creating environment configuration..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Please edit backend/.env with your database and configuration settings"
fi

# Initialize Alembic
echo "🗄️ Initializing database migrations..."
alembic init migrations

# Frontend Setup
echo "🔧 Setting up frontend..."
cd ../frontend

# Install dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Create .env file
echo "⚙️ Creating environment configuration..."
if [ ! -f .env ]; then
    cp env.example .env
    echo "📝 Please edit frontend/.env with your API and Firebase configuration"
fi

# Install React Native CLI if not present
if ! command -v react-native &> /dev/null; then
    echo "📦 Installing React Native CLI..."
    npm install -g react-native-cli
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your database in backend/.env"
echo "2. Set up Firebase for push notifications in frontend/.env"
echo "3. Create and run database migrations:"
echo "   cd backend && source venv/bin/activate && alembic upgrade head"
echo "4. Start the backend server:"
echo "   cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "5. Start the React Native app:"
echo "   cd frontend && npm start"
echo ""
echo "📚 For detailed setup instructions, see README.md"
echo "🐛 For issues, check the troubleshooting section in the documentation"

