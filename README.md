# 🎮 Points Game App

A full-stack MERN application where users can issue games to others and claim random points. Includes authentication, leaderboard tracking, and game history.

---

## 🌐 Live Links

- **Frontend:** [https://points-game-frontend.onrender.com](https://points-game-frontend.onrender.com)
- **Backend:** [https://points-game.onrender.com](https://points-game.onrender.com)

---

## 📦 Tech Stack

- **Frontend:** React + Vite, React Router, Axios, Toastify
- **Backend:** Express.js, MongoDB, Mongoose, JWT Auth, Passport.js
- **Deployment:** Render (both frontend and backend)

---

## 🔐 Authentication

- Passport.js (Local Strategy)
- JWT for token-based protection
- Protected Routes (React Router + custom logic)

---

## 🧠 Features

- 🔐 User registration & login
- 🧾 Dashboard to see points collected and history
- 🎁 Claim random points (1–10)
- 🎯 Issue games to other users
- 🏆 Live leaderboard
- 🔒 Protected routes for logged-in users

---

## ⚙️ .env Variables (Backend)

```env
PORT=3000
MONGO_URI=YOUR_MONGODB_URI_HERE
JWT_SECRET=yourSuperSecretKey
CLIENT_URL=https://points-game-frontend.onrender.com
```

---

## 🚀 Setup & Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/your-username/points-game.git
cd points-game
```

### 2. Set up Backend

```bash
cd backend
npm install
touch .env
# Fill in the .env file with your own values
node server.js
```

### 3. Set up Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Folder Structure

```
root/
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   └── vite.config.js
└── README.md
```

---

## 🐛 Known Issues

- Some UI transitions can be smoother
- Token expiration handling could be improved further

---

## 👨‍💻 Author

- **Name:** Sumanraj Bera  
- **GitHub:** [github.com/SumanrajBera](https://github.com/SumanrajBera)  
- **Email:** berasumanraj@gmail.com

---
