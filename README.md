# Adaptive Micro-Habit App

A mobile application that helps users build long-term habits by breaking them down into adaptive micro-habits. The app uses AI to adjust habit difficulty based on user performance and provides a gamified experience with a friendly mascot.

## Tech Stack

- **Backend**: Python with FastAPI
- **Database**: PostgreSQL
- **Frontend**: React Native with Redux Toolkit
- **Notifications**: Firebase Cloud Messaging (FCM)
- **AI/ML**: Custom Python logic with optional Hugging Face/OpenAI integration

## Project Structure

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

## Features

- **User Authentication**: JWT-based auth with email/password and social login
- **Habit Management**: Create, view, and manage personal habits
- **Micro-Habit Engine**: AI-powered micro-habit generation and tracking
- **Adaptive Difficulty**: Automatic difficulty adjustment based on performance
- **Notifications**: Daily reminders and motivational messages
- **Mascot System**: Friendly character with personalized interactions

## Quick Start

### Option 1: Automated Setup (Recommended)

Run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

### Option 2: Quick Run (After Setup)

If you've already run the setup script, you can quickly start both backend and frontend:

```bash
# On macOS/Linux:
chmod +x run.sh
./run.sh

# On Windows:
run.bat
```

### Option 3: Manual Setup

For detailed manual setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

## Manual Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- React Native development environment

### Backend Setup

1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your database and configuration settings
   ```
6. Create PostgreSQL database:
   ```sql
   CREATE DATABASE mirai_db;
   ```
7. Run database migrations: `alembic upgrade head`
8. Start the server: `uvicorn app.main:app --reload`

### Frontend Setup

1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your API and Firebase configuration
   ```
4. For iOS: `cd ios && pod install && cd ..`
5. Start the development server: `npm start`
6. Run on device/simulator: `npm run ios` or `npm run android`

### Firebase Setup (Optional)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Cloud Messaging
3. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
4. Place them in the appropriate directories
5. Update your `.env` file with Firebase configuration

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

## Development

### Backend Development

- API endpoints are in `backend/app/api/api_v1/endpoints/`
- Database models are in `backend/app/models/`
- Business logic is in `backend/app/services/`
- Run tests: `pytest`

### Frontend Development

- Screens are in `frontend/src/screens/`
- Components are in `frontend/src/components/`
- Redux store is in `frontend/src/store/`
- API services are in `frontend/src/services/`
- Run tests: `npm test`

## Deployment

### Backend Deployment

1. Set up a PostgreSQL database
2. Configure environment variables for production
3. Run migrations: `alembic upgrade head`
4. Deploy using your preferred method (Docker, Heroku, etc.)

### Frontend Deployment

1. Build for production: `npm run build:android` or `npm run build:ios`
2. Deploy to app stores or distribute APK/IPA files

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check your PostgreSQL service and connection string
2. **React Native build errors**: Ensure you have the correct development environment setup
3. **Firebase errors**: Verify your Firebase configuration and credentials
4. **API connection errors**: Check that the backend is running and accessible

### Getting Help

- Check the API documentation at `http://localhost:8000/docs`
- Review the logs for detailed error messages
- Ensure all dependencies are properly installed
