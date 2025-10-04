# 🚀 Mirai App - Complete Setup & Run Guide

This guide will walk you through setting up and running the Mirai Adaptive Micro-Habit App from scratch.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Python 3.8+** - [Download here](https://www.python.org/downloads/)
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **PostgreSQL 12+** - [Download here](https://www.postgresql.org/download/)
- **Git** - [Download here](https://git-scm.com/downloads)

### For React Native Development
- **Android Studio** (for Android development) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available on Mac App Store
- **React Native CLI**: `npm install -g react-native-cli`

## 🛠️ Quick Setup (Automated)

The easiest way to get started is using the automated setup script:

```bash
# Make the setup script executable
chmod +x setup.sh

# Run the setup script
./setup.sh
```

This will automatically:
- Check prerequisites
- Set up Python virtual environment
- Install backend dependencies
- Install frontend dependencies
- Create environment files

## 🔧 Manual Setup

If you prefer to set up manually or the automated script doesn't work:

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp env.example .env
```

### 2. Database Setup

```bash
# Start PostgreSQL service (varies by OS)
# On macOS with Homebrew:
brew services start postgresql
# On Ubuntu/Debian:
sudo systemctl start postgresql
# On Windows:
# Start PostgreSQL from Services

# Create database
psql -U postgres
CREATE DATABASE mirai_db;
\q

# Run database migrations
alembic upgrade head
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Create environment file
cp env.example .env

# For iOS development (macOS only):
cd ios && pod install && cd ..
```

## ⚙️ Configuration

### Backend Configuration

Edit `backend/.env` with your settings:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/mirai_db

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App Configuration
APP_NAME=Adaptive Micro-Habit App
DEBUG=True
API_V1_STR=/api/v1
```

### Frontend Configuration

Edit `frontend/.env` with your settings:

```env
# API Configuration
API_BASE_URL=http://localhost:8000/api/v1

# App Configuration
APP_NAME=MiraiApp
APP_VERSION=1.0.0
DEBUG=true
```

## 🚀 Running the Application

### 1. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate  # On Windows

# Start the FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at:
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### 2. Start the Frontend App

Open a new terminal and run:

```bash
# Navigate to frontend directory
cd frontend

# Start the React Native development server
npm start
```

This will open the Metro bundler. Then:

#### For Android:
```bash
# In a new terminal
npm run android
```

#### For iOS (macOS only):
```bash
# In a new terminal
npm run ios
```

## 📱 Testing the App

### 1. Backend Testing

Visit http://localhost:8000/docs to see the interactive API documentation and test endpoints.

### 2. Frontend Testing

The app should open on your device/emulator. You can:
- Create an account
- Log in
- Create habits
- Track your progress

## 🔧 Development Commands

### Backend Commands

```bash
# Run tests
pytest

# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Check migration status
alembic current

# Rollback migration
alembic downgrade -1
```

### Frontend Commands

```bash
# Run tests
npm test

# Run linting
npm run lint

# Fix linting issues
npm run lint -- --fix

# Build for production
npm run build:android
npm run build:ios
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```bash
# Check if PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check database exists
psql -U postgres -l | grep mirai_db
```

#### 2. Python Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 3. Node.js Dependencies Issues
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 4. React Native Build Issues
```bash
# Clear React Native cache
npx react-native start --reset-cache

# For Android, clean build
cd android && ./gradlew clean && cd ..

# For iOS, clean build
cd ios && xcodebuild clean && cd ..
```

#### 5. Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Getting Help

1. **Check the logs**: Look at terminal output for detailed error messages
2. **API Documentation**: Visit http://localhost:8000/docs for backend API details
3. **React Native Debugger**: Use the debugger in your development environment
4. **Database**: Check PostgreSQL logs for database-related issues

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Native Documentation](https://reactnative.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## 🎯 Next Steps

Once everything is running:

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Test the mobile app**: Create an account and try the features
3. **Customize**: Modify the code to add your own features
4. **Deploy**: Follow the deployment guide in README.md

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Review the main README.md
3. Check the logs for specific error messages
4. Ensure all prerequisites are properly installed

Happy coding! 🎉
