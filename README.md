# Adaptive Micro-Habit App (Project Mirai)

A mobile application that helps users build long-term habits by breaking them down into **adaptive micro-habits**. The app uses AI to adjust habit difficulty based on user performance and provides a **gamified experience** with a friendly mascot.

> ⚠️ **Note:** This project is currently under active development and is **not yet complete**.  
> We welcome **open-source contributions** from developers, designers, and AI enthusiasts to help shape the future of Mirai! 🎉  
> Check the [Contributing](#contributing) section below for details.

---

## 🧠 Overview

Mirai aims to make habit-building fun and achievable by focusing on **micro-progress**. Instead of overwhelming users with big goals, it breaks habits into smaller adaptive steps that evolve with user performance.

---

## 🛠️ Tech Stack

- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Frontend:** React Native (with Redux Toolkit)
- **Notifications:** Firebase Cloud Messaging (FCM)
- **AI/ML:** Custom Python logic with optional Hugging Face / OpenAI integration

---

## 📁 Project Structure

```
Mirai/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   └── requirements.txt
├── frontend/               # React Native app
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── screens/        # App screens
│   │   ├── store/          # Redux store
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
│   └── package.json
└── docs/                   # Documentation
```

---

## ✨ Features

- **User Authentication:** JWT-based with email/password and social login  
- **Habit Management:** Create, view, and manage personal habits  
- **Micro-Habit Engine:** AI-driven micro-habit generation and tracking  
- **Adaptive Difficulty:** Dynamic habit adjustment based on user performance  
- **Notifications:** Daily reminders and motivational prompts via FCM  
- **Mascot System:** Friendly AI-powered companion for engagement  

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Quick Run (After Setup)

```bash
# macOS/Linux
chmod +x run.sh
./run.sh

# Windows
run.bat
```

### Option 3: Manual Setup

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

---

## ⚙️ Manual Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- React Native environment configured

---

### 🧩 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   venv\Scripts\activate     # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment:
   ```bash
   cp env.example .env
   ```
5. Create database:
   ```sql
   CREATE DATABASE mirai_db;
   ```
6. Run migrations:
   ```bash
   alembic upgrade head
   ```
7. Start the server:
   ```bash
   uvicorn app.main:app --reload
   ```

---

### 📱 Frontend Setup

1. Navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment:
   ```bash
   cp env.example .env
   ```
4. iOS setup (Mac only):
   ```bash
   cd ios && pod install && cd ..
   ```
5. Start app:
   ```bash
   npm start
   npm run ios   # or npm run android
   ```

---

### 🔔 Firebase Setup (Optional)

1. Create a Firebase project  
2. Enable **Cloud Messaging**  
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)  
4. Place files in respective directories  
5. Update `.env` with Firebase configs  

---

## 📖 API Documentation

Once the backend is running, visit:

👉 **http://localhost:8000/docs**

for interactive API testing (Swagger UI).

---

## 🧪 Development Guidelines

### Backend

- Endpoints: `backend/app/api/api_v1/endpoints/`
- Models: `backend/app/models/`
- Services: `backend/app/services/`
- Run tests:
  ```bash
  pytest
  ```

### Frontend

- Screens: `frontend/src/screens/`
- Components: `frontend/src/components/`
- Store: `frontend/src/store/`
- API services: `frontend/src/services/`
- Run tests:
  ```bash
  npm test
  ```

---

## 🚢 Deployment

### Backend

1. Configure production `.env`
2. Run migrations: `alembic upgrade head`
3. Deploy (Docker, Render, or Railway)

### Frontend

1. Build for production:
   ```bash
   npm run build:android
   npm run build:ios
   ```
2. Deploy to app stores or distribute APK/IPA files

---

## 🐞 Troubleshooting

**Common Issues**
| Problem | Solution |
|----------|-----------|
| Database errors | Check PostgreSQL connection string |
| React Native build issues | Verify correct SDK and Node versions |
| Firebase errors | Double-check credentials |
| API not connecting | Ensure backend is running locally |

---

## 🤝 Contributing

We’re excited to have contributors join the project! 💡  
If you’d like to contribute:

1. **Fork** this repository  
2. **Create** a feature branch  
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** changes and push  
4. **Open a Pull Request** with a clear description

### Contribution Ideas

- Implement missing API endpoints  
- Improve AI/micro-habit recommendation logic  
- Design better mascot interactions  
- Add UI improvements and animations  
- Write tests and improve documentation  

Your name will be credited in the **Contributors** section once merged! 🏆

---

## 🧭 Roadmap

- [ ] AI-based adaptive difficulty engine  
- [ ] Gamified reward system  
- [ ] Enhanced mascot personality  
- [ ] Social habit challenges  
- [ ] Cross-platform deployment (Android & iOS)

---

## 📫 Getting Help

- Check API docs at `http://localhost:8000/docs`
- Review console/logs for error details
- Open an issue on GitHub for support

---

## 💬 Acknowledgements

Built with ❤️ by contributors who believe in small steps leading to big change.  
Let’s make habit-building smarter, one micro-step at a time.

---

> 🌱 _“Consistency beats intensity — one micro-habit at a time.”_
