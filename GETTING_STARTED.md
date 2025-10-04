# 🎯 Getting Started with Mirai

Welcome to Mirai, your adaptive micro-habit tracking app! This guide will get you up and running in minutes.

## 🚀 Quick Start (3 Steps)

### Step 1: Prerequisites
Make sure you have these installed:
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **PostgreSQL 12+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

### Step 2: Setup
```bash
# Clone the repository (if you haven't already)
git clone <your-repo-url>
cd Mirai

# Run the automated setup
chmod +x setup.sh
./setup.sh
```

### Step 3: Run
```bash
# Start both backend and frontend
./run.sh          # macOS/Linux
run.bat           # Windows
```

That's it! 🎉

## 📱 What You'll See

### Backend (Terminal)
- FastAPI server running on http://localhost:8000
- Interactive API docs at http://localhost:8000/docs
- Health check at http://localhost:8000/health

### Frontend (Mobile App)
- React Native app with Metro bundler
- Beautiful habit tracking interface
- User authentication and habit management

## 🎮 Try These Features

1. **Create Account**: Sign up with email and password
2. **Create Habits**: Add your first habit (e.g., "Read for 5 minutes")
3. **Track Progress**: Mark habits as complete
4. **View Stats**: See your completion rates and streaks
5. **Explore**: Navigate through different screens

## 🔧 Development

### Backend Development
- **API Endpoints**: `backend/app/api/api_v1/endpoints/`
- **Database Models**: `backend/app/models/`
- **Business Logic**: `backend/app/services/`
- **Run Tests**: `pytest`

### Frontend Development
- **Screens**: `frontend/src/screens/`
- **Components**: `frontend/src/components/`
- **State Management**: `frontend/src/store/`
- **API Services**: `frontend/src/services/`
- **Run Tests**: `npm test`

## 📚 Documentation

- **[Complete Setup Guide](SETUP_GUIDE.md)** - Detailed setup instructions
- **[Development Checklist](DEVELOPMENT_CHECKLIST.md)** - Development checklist
- **[Main README](README.md)** - Project overview and features

## 🐛 Need Help?

### Common Issues
1. **Database connection error**: Make sure PostgreSQL is running
2. **Port already in use**: Kill existing processes or use different ports
3. **Dependencies not found**: Run the setup script again
4. **Build failures**: Clear caches and reinstall dependencies

### Getting Support
1. Check the troubleshooting sections in the guides above
2. Look at terminal logs for specific error messages
3. Ensure all prerequisites are properly installed
4. Try the automated setup script first

## 🎯 Next Steps

Once you're up and running:

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Customize the app**: Modify the code to add your features
3. **Add Firebase**: Set up push notifications (optional)
4. **Deploy**: Follow deployment guides for production

## 🏆 Success!

If you can see the API docs and the mobile app is running, congratulations! You've successfully set up Mirai. 

Now you can start building amazing habit-tracking features! 🚀

---

**Happy coding!** If you have any questions, check the detailed guides or look at the code - it's well-documented and easy to understand.
