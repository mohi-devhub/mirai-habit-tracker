@echo off
echo 🚀 Starting Mirai App...

REM Check if backend is already running
netstat -an | find "8000" >nul
if %errorlevel% == 0 (
    echo ⚠️  Backend server is already running on port 8000
) else (
    echo 🔧 Starting backend server...
    cd backend
    
    REM Check if virtual environment exists
    if not exist "venv" (
        echo ❌ Virtual environment not found. Please run setup.sh first.
        pause
        exit /b 1
    )
    
    REM Activate virtual environment and start server
    call venv\Scripts\activate
    start "Backend Server" uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    echo ✅ Backend server started
    cd ..
)

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Check if frontend is already running
netstat -an | find "8081" >nul
if %errorlevel% == 0 (
    echo ⚠️  Metro bundler is already running on port 8081
) else (
    echo 🔧 Starting frontend development server...
    cd frontend
    
    REM Check if node_modules exists
    if not exist "node_modules" (
        echo ❌ Node modules not found. Please run setup.sh first.
        pause
        exit /b 1
    )
    
    REM Start React Native development server
    start "Frontend Server" npm start
    echo ✅ Frontend development server started
    cd ..
)

echo.
echo 🎉 Mirai App is starting up!
echo.
echo 📱 Frontend:
echo    - Metro bundler: http://localhost:8081
echo    - Run on Android: npm run android
echo    - Run on iOS: npm run ios
echo.
echo 🔧 Backend:
echo    - API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo    - Health Check: http://localhost:8000/health
echo.
echo 🛑 To stop the servers, close the command windows or press Ctrl+C
echo.

pause
