# 🕉️ Indian Temple Heritage Museum

> *Where ancient heritage meets modern technology*

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r150-000000?logo=three.js)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776ab?logo=python)](https://www.python.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479a1?logo=mysql)](https://www.mysql.com/)

**An immersive 3D virtual museum showcasing India's sacred temples, ancient weapons, and cultural heritage through interactive WebGL experiences.**

---

## 📖 Why This Exists

India's temples are living museums of art, architecture, and history spanning thousands of years. This project brings that experience to your browser—explore 3D models of iconic temples, ancient weapons, and symbolic animals from Indian mythology. It's educational, immersive, and accessible to anyone, anywhere.

---

## ✨ Features

🎮 **Interactive 3D Museum** - Explore 32 temples, ancient weapons, and mythological symbols  
🎯 **Gamification** - Leaderboards, achievements, and visit tracking  
🔐 **User Accounts** - Secure JWT authentication with personalized experiences  
🎨 **Admin Panel** - Full content management system with real-time analytics  
📊 **Analytics Dashboard** - Track visitor engagement and popular exhibits  
💬 **Feedback System** - User ratings and suggestions  

---

## 🛠️ Tech Stack

**Frontend:** React 18 • TypeScript • Three.js • Vite • Axios  
**Backend:** FastAPI • Python 3.11 • SQLModel • MySQL 8.0  
**Authentication:** JWT • BCrypt Password Hashing  
**3D Graphics:** React Three Fiber • Three.js  

---

## 📁 Project Structure

```
indian-temple-museum/
├── backend/
│   ├── app/
│   │   ├── api/              # REST API endpoints
│   │   ├── core/             # Config, security, database
│   │   ├── db/               # Database models & operations
│   │   ├── data/             # JSON data (temples, weapons, animals)
│   │   └── static/           # Images and audio files
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Main pages (Home, Dashboard)
│   │   ├── scenes/           # 3D scenes for each room
│   │   ├── services/         # API client
│   │   └── contexts/         # Auth state management
│   └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8.0+

### Installation

**1. Clone & Setup Backend**
```bash
git clone https://github.com/Krishna-pathak1535/Indian-Temple-Heritage-Museum.git
cd Indian-Temple-Heritage-Museum/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env       # Windows
cp .env.example .env         # Mac/Linux
# Edit .env with your MySQL credentials
```

**2. Setup Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE temple_museum;
exit;

# Create admin user
python create_admin.py
```

**3. Start Backend**
```bash
uvicorn app.main:app --reload
# Runs at http://localhost:8000
```

**4. Setup Frontend** *(New Terminal)*
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

**5. Open Browser**  
Visit `http://localhost:5173` and start exploring!

---

## 🎮 Usage

### For Visitors
1. **Register/Login** to create your account
2. **Explore Rooms** - Choose from Temples, Weapons, or Animals exhibitions
3. **View 3D Models** - Click any item to see it in interactive 3D
4. **Earn Points** - Visit rooms to climb the leaderboard
5. **Give Feedback** - Rate your experience and share thoughts

### For Admins
1. **Login** with admin credentials
2. **Manage Content** - Add/Edit/Delete exhibits across all categories
3. **Upload Media** - Add images, audio guides, and 3D model links
4. **View Analytics** - Monitor visitor engagement in real-time
5. **Read Feedback** - See user ratings and suggestions

---

## 🎨 Museum Collections

**Sacred Temples (32)**  
Ayodhya Ram Mandir • Konark Sun Temple • Golden Temple • Meenakshi Temple • Brihadeeswarar Temple • and 27 more

**Ancient Weapons (12)**  
Khanda • Talwar • Gada • Dhanush • Chakram • Traditional Indian armory

**Mythological Symbols (11)**  
Bengal Tiger • Asiatic Lion • Indian Elephant • Peacock • Sacred creatures from Indian culture

---

## 📊 Database Schema

```
Users → (id, email, hashed_password, is_admin, created_at)
Temples/Weapons/Fossils → (id, name, description, images, audio, model_url, era)
Visits → (id, user_id, room, visited_at)
High_Scores → (id, user_id, score, game_mode, achieved_at)
Feedback → (id, user_id, rating, message, created_at)
```

---

## 🔧 Configuration

**Backend `.env`**
```bash
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=temple_museum
SECRET_KEY=your-secret-key-min-32-chars
FRONTEND_URL=http://localhost:5173
```

**Frontend `config.ts`**
```typescript
export const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---


## 🤝 Contributing

This is an academic project, but contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📝 License

Educational project. 3D models sourced from Sketchfab and belong to their respective creators.

---

## 🙏 Acknowledgments

**Sketchfab** - Amazing 3D models  
**FastAPI** - Incredible Python framework  
**React Three Fiber** - Making 3D accessible in React  
**Indian Heritage** - The inspiration behind everything  

---

## 📧 Contact

**Krishnanand Pathak**

📧 Email: krishna.pathak2003@gmail.com  
💼 LinkedIn: [linkedin.com/in/krishnanand-pathak](https://www.linkedin.com/in/krishnanand-pathak/)  
🐙 GitHub: [@Krishna-pathak1535](https://github.com/Krishna-pathak1535)  
🔗 Project: [Indian-Temple-Heritage-Museum](https://github.com/Krishna-pathak1535/Indian-Temple-Heritage-Museum)

---

<div align="center">

**Made with ❤️ for preserving and celebrating Indian heritage**

⭐ Star this repo if you found it interesting! ⭐

</div>
