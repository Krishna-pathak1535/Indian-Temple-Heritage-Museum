# 🕉️ Indian Temple Heritage Museum - Setup Guide

## 📋 Prerequisites

Before starting, ensure you have the following installed:

1. **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16+** - [Download Node.js](https://nodejs.org/)
3. **MySQL 8.0+** - [Download MySQL](https://dev.mysql.com/downloads/mysql/)

---

## 🚀 Quick Setup Instructions

### Step 1: Database Setup

1. **Start MySQL Server**
   - Ensure MySQL is running on your system
   - Default port: 3306

2. **Create Database** (Optional - will auto-create)
   ```sql
   CREATE DATABASE temple_museum;
   ```

### Step 2: Backend Setup

1. **Navigate to backend folder**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   
   **Windows:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```
   
   **Mac/Linux:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update MySQL password in `.env`:
   ```env
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password_here
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   ```

5. **Create admin user**
   ```bash
   python create_admin.py
   ```
   
   Default credentials:
   - **Email:** admin@museum.com
   - **Password:** admin123

6. **Start backend server**
   ```bash
   uvicorn app.main:app --reload
   ```
   
   Backend will run on: **http://localhost:8000**

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend folder**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start frontend development server**
   ```bash
   npm run dev
   ```
   
   Frontend will run on: **http://localhost:5173**

---

## 🎯 Access the Application

1. **Open your browser** and go to: **http://localhost:5173**

2. **Login as Admin**
   - Click "Login" button
   - Email: `admin@museum.com`
   - Password: `admin123`

3. **Access Admin Dashboard**
   - After login, you'll be automatically redirected to `/admin`
   - Or navigate to: **http://localhost:5173/admin**

---

## 📊 Data Verification

The project includes:
- ✅ **65 Temples** with images, audio, and 3D models
- ✅ **15 Weapons** with images, audio, and 3D models
- ✅ **8 Fossils** with images, audio, and 3D models

All data files are located in:
- `backend/app/data/*.json` - JSON data files
- `backend/app/static/images/` - Image files
- `backend/app/static/audio/` - Audio story files

---

## 🔧 Admin Dashboard Features

After logging in as admin, you can:

1. **🕌 Temples Tab** - Add/Edit/Delete temple entries
2. **⚔️ Weapons Tab** - Add/Edit/Delete weapon entries
3. **🦴 Fossils Tab** - Add/Edit/Delete fossil entries
4. **📊 Analytics Tab** - View visit statistics
5. **🏆 Leaderboard Tab** - View quiz high scores
6. **💬 Feedback Tab** - View user feedback

---

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify MySQL is running
- Check `.env` file has correct password
- Ensure MySQL port 3306 is not blocked

**Port Already in Use:**
```bash
# Change port in command
uvicorn app.main:app --reload --port 8001
```

### Frontend Issues

**Module Not Found:**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port Already in Use:**
```bash
# Vite will automatically suggest next available port
# Or specify port manually in vite.config.ts
```

---

## 📝 API Documentation

Once backend is running, access interactive API docs:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🔒 Security Notes

### Change Default Admin Password

After first login, create a new admin account:

1. **Via Script:**
   ```bash
   cd backend
   python create_admin.py
   # Enter new email and password when prompted
   ```

2. **Via Database:**
   ```sql
   UPDATE users SET is_admin = 1 WHERE email = 'newemail@example.com';
   ```

### Change JWT Secret Key

Update in `.env`:
```env
SECRET_KEY=your-new-super-secret-key-change-this-in-production
```

---

## 🎮 Testing the Application

1. **Register a regular user** from the homepage
2. **Explore temple rooms** in 3D
3. **Listen to audio stories**
4. **Play quiz games**
5. **Submit feedback**
6. **Check leaderboard**

---

## 📦 Project Structure

```
indian-temple-museum/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core functionality (JWT, DB, schemas)
│   │   ├── data/         # JSON data files
│   │   ├── db/           # Database models and CRUD
│   │   └── static/       # Images and audio files
│   ├── .env.example      # Environment template
│   ├── requirements.txt  # Python dependencies
│   └── create_admin.py   # Admin creation script
│
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── scenes/       # 3D scenes
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   ├── package.json      # Node dependencies
│   └── vite.config.ts    # Vite configuration
│
└── SETUP_GUIDE.md        # This file
```

---

## 💡 Additional Notes

- **Session Timeout:** 24 hours (1440 minutes)
- **Database Auto-Creation:** App creates database if it doesn't exist
- **Data Auto-Loading:** JSON data loads automatically on first startup
- **Hot Reload:** Both backend and frontend support hot reload during development

---

## 📞 Support

For issues or questions:
1. Check backend terminal logs for error messages
2. Check browser console (F12) for frontend errors
3. Verify `.env` configuration
4. Ensure all ports are available (3306, 8000, 5173)

---

## ✅ Quick Verification Checklist

- [ ] MySQL installed and running
- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Backend `.env` file configured
- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Admin user created (`python create_admin.py`)
- [ ] Backend server running (port 8000)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Frontend server running (port 5173)
- [ ] Can login as admin (admin@museum.com / admin123)
- [ ] Can access admin dashboard at /admin
- [ ] Can see 65 temples, 15 weapons, 8 fossils in admin panel

---

**🎉 Your Indian Temple Heritage Museum is ready!**
