# 🛠️ Development Checklist

Use this checklist to ensure your development environment is properly set up and running.

## ✅ Prerequisites Check

- [ ] Python 3.8+ installed (`python3 --version`)
- [ ] Node.js 16+ installed (`node --version`)
- [ ] PostgreSQL 12+ installed and running (`psql --version`)
- [ ] Git installed (`git --version`)

### For React Native Development
- [ ] Android Studio installed (for Android development)
- [ ] Xcode installed (for iOS development, macOS only)
- [ ] React Native CLI installed (`npm install -g react-native-cli`)

## ✅ Initial Setup

- [ ] Cloned the repository
- [ ] Run setup script: `./setup.sh` (or manual setup)
- [ ] Backend virtual environment created and activated
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Environment files created (`.env` files)

## ✅ Database Setup

- [ ] PostgreSQL service running
- [ ] Database `mirai_db` created
- [ ] Database migrations applied (`alembic upgrade head`)
- [ ] Database connection tested

## ✅ Backend Setup

- [ ] Virtual environment activated
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Server starts without errors (`uvicorn app.main:app --reload`)
- [ ] API accessible at http://localhost:8000
- [ ] API documentation accessible at http://localhost:8000/docs
- [ ] Health check passes at http://localhost:8000/health

## ✅ Frontend Setup

- [ ] Node.js dependencies installed
- [ ] Environment variables configured
- [ ] Metro bundler starts (`npm start`)
- [ ] App builds for target platform:
  - [ ] Android (`npm run android`)
  - [ ] iOS (`npm run ios`)

## ✅ Testing

- [ ] Backend API endpoints respond correctly
- [ ] Frontend app loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Habit creation works
- [ ] Habit tracking works

## 🚀 Quick Start Commands

### Start Everything
```bash
# Automated (recommended)
./run.sh          # macOS/Linux
run.bat           # Windows

# Manual
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - Run on device
npm run android   # or npm run ios
```

### Development Commands
```bash
# Backend
cd backend
source venv/bin/activate
pytest                    # Run tests
alembic upgrade head      # Apply migrations
alembic revision --autogenerate -m "Description"  # Create migration

# Frontend
cd frontend
npm test                  # Run tests
npm run lint              # Check code style
npm run lint -- --fix     # Fix code style issues
```

## 🐛 Common Issues & Solutions

### Backend Issues
- **Port 8000 in use**: Kill process or use different port
- **Database connection error**: Check PostgreSQL is running and credentials
- **Import errors**: Ensure virtual environment is activated
- **Migration errors**: Check database exists and user has permissions

### Frontend Issues
- **Metro bundler won't start**: Clear cache with `npx react-native start --reset-cache`
- **Build failures**: Clean build folders and reinstall dependencies
- **Device not found**: Check device/emulator is connected and authorized
- **API connection errors**: Verify backend is running and URL is correct

### General Issues
- **Permission errors**: Check file permissions and user access
- **Network issues**: Check firewall and network configuration
- **Version conflicts**: Ensure all tools are compatible versions

## 📱 Testing on Devices

### Android
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run `npm run android`

### iOS (macOS only)
1. Open Xcode
2. Select your device/simulator
3. Run `npm run ios`

## 🔧 Development Tips

1. **Use the API docs**: Visit http://localhost:8000/docs for interactive API testing
2. **Check logs**: Monitor terminal output for error messages
3. **Hot reload**: Both backend and frontend support hot reloading
4. **Database tools**: Use pgAdmin or similar tools for database management
5. **Debugging**: Use React Native debugger for frontend debugging

## 📚 Useful URLs

- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Metro Bundler**: http://localhost:8081

## 🆘 Getting Help

1. Check this checklist first
2. Review the [SETUP_GUIDE.md](SETUP_GUIDE.md)
3. Check the main [README.md](README.md)
4. Look at terminal logs for specific error messages
5. Ensure all prerequisites are properly installed

Happy coding! 🎉
