import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import QuizPlay from './pages/QuizPlay';
import QuizResult from './pages/QuizResult';
import RandomQuiz from './pages/RandomQuiz';
import Dashboard from './pages/Dashboard';
import AdminQuizzes from './pages/AdminQuizzes';
import AdminQuizForm from './pages/AdminQuizForm';
import AdminAnalytics from './pages/AdminAnalytics';
import './App.css';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/quiz/:id" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
      <Route path="/quiz-result" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
      <Route path="/random-quiz" element={<ProtectedRoute><RandomQuiz /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin/quizzes" element={<ProtectedRoute adminOnly><AdminQuizzes /></ProtectedRoute>} />
      <Route path="/admin/quizzes/new" element={<ProtectedRoute adminOnly><AdminQuizForm /></ProtectedRoute>} />
      <Route path="/admin/quizzes/edit/:id" element={<ProtectedRoute adminOnly><AdminQuizForm /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <AppRoutes />
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: 'var(--surface-color)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  fontSize: '14px'
                }
              }}
            />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
