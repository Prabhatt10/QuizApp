# 🚀 QuizMaster — MERN Stack Online Quiz Application

A full-stack quiz application built with **MongoDB**, **Express.js**, **React.js**, and **Node.js**.

## ✨ Features

### 🔐 Authentication

- JWT-based signup/login/logout
- Role support (admin / user)
- Protected routes

### 📝 Quiz Management (Admin)

- Create, update, delete quizzes
- Dynamic question builder with options & correct answers
- Category and time limit settings

### 🎮 Quiz Playing

- Timer-based quiz attempts
- Progress bar and question navigation dots
- Score calculation and answer review

### 🎲 Random Quiz (Open Trivia DB)

- Fetch questions from external API
- Configurable difficulty and question count
- Shuffled options, no database save

### 📊 Dashboard & Analytics

- User score history table
- Global leaderboard (top 20)
- Admin analytics: total users, quizzes, attempts, category breakdown

### 🎨 UI/UX

- Dark / Light theme toggle
- Glassmorphism cards with gradient accents
- Responsive design (mobile-ready)
- Toast notifications
- Loading skeletons
- Smooth animations

---

## 📂 Folder Structure

```
Quiz App/
├── server/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── quizController.js
│   │   ├── attemptController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Quiz.js
│   │   └── Attempt.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── attemptRoutes.js
│   │   └── dashboardRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── client/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── components/ (Navbar, ProtectedRoute, LoadingSkeleton, Leaderboard)
│   │   ├── context/ (AuthContext, ThemeContext)
│   │   ├── pages/ (Login, Signup, Home, QuizPlay, QuizResult, RandomQuiz, Dashboard, AdminQuizzes, AdminQuizForm, AdminAnalytics)
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## 🛠️ How to Run

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local or Atlas)

### 1. Clone / Open the project

```bash
cd "Quiz App"
```

### 2. Start the Backend

```bash
cd server
npm install
```

Edit `.env` to set your MongoDB URI:

```env
MONGO_URI=mongodb://localhost:27017/quizapp
JWT_SECRET=your_secret_key
PORT=5000
```

```bash
npm start
```

### 3. Start the Frontend

```bash
cd client
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 API Routes

| Method | Route                        | Auth  | Description              |
| ------ | ---------------------------- | ----- | ------------------------ |
| POST   | `/api/auth/signup`           | ✗     | Register                 |
| POST   | `/api/auth/login`            | ✗     | Login                    |
| GET    | `/api/auth/me`               | ✓     | Current user             |
| GET    | `/api/quizzes`               | ✓     | List quizzes (paginated) |
| GET    | `/api/quizzes/:id`           | ✓     | Get quiz                 |
| POST   | `/api/quizzes`               | Admin | Create quiz              |
| PUT    | `/api/quizzes/:id`           | Admin | Update quiz              |
| DELETE | `/api/quizzes/:id`           | Admin | Delete quiz              |
| POST   | `/api/attempts`              | ✓     | Submit attempt           |
| GET    | `/api/attempts/my`           | ✓     | User history             |
| GET    | `/api/dashboard/leaderboard` | ✓     | Leaderboard              |
| GET    | `/api/dashboard/admin-stats` | Admin | Analytics                |

---

## 👤 Creating an Admin User

After signing up, manually set the role in MongoDB:

```javascript
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } });
```

---

## 📦 Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React 19, Vite, React Router, Axios |
| Backend      | Node.js, Express.js                 |
| Database     | MongoDB, Mongoose                   |
| Auth         | JWT, bcryptjs                       |
| External API | Open Trivia Database                |
| Styling      | Vanilla CSS (custom design system)  |
