#!/bin/bash

# Mirai App - Run Script (Expo Version)
echo "🚀 Starting Mirai App with Expo..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
}

# Check if backend is already running
if port_in_use 8000; then
    echo "⚠️  Backend server is already running on port 8000"
else
    echo "🔧 Starting backend server..."
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        echo "❌ Virtual environment not found. Please run setup.sh first."
        exit 1
    fi
    
    # Activate virtual environment and start server
    source venv/bin/activate
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    echo "✅ Backend server started (PID: $BACKEND_PID)"
    cd ..
fi

# Wait a moment for backend to start
sleep 3

# Check if frontend is already running
if port_in_use 8081; then
    echo "⚠️  Expo development server is already running on port 8081"
else
    echo "🔧 Starting Expo development server..."
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo "❌ Node modules not found. Please run setup.sh first."
        exit 1
    fi
    
    # Start Expo development server
    npx expo start &
    FRONTEND_PID=$!
    echo "✅ Expo development server started (PID: $FRONTEND_PID)"
    cd ..
fi

echo ""
echo "🎉 Mirai App is starting up!"
echo ""
echo "📱 Frontend (Expo):"
echo "   - Expo Dev Server: http://localhost:8081"
echo "   - Press 'i' for iOS simulator"
echo "   - Press 'a' for Android emulator"
echo "   - Scan QR code with Expo Go app on your phone"
echo ""
echo "🔧 Backend:"
echo "   - API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo "   - Health Check: http://localhost:8000/health"
echo ""
echo "📱 To view on your phone:"
echo "   1. Install 'Expo Go' app from App Store/Play Store"
echo "   2. Scan the QR code that appears in the terminal"
echo "   3. Your app will load on your phone!"
echo ""
echo "🛑 To stop the servers:"
echo "   - Press Ctrl+C to stop this script"
echo "   - Or kill the processes manually"
echo ""

# Wait for user to stop
wait
