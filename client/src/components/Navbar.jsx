import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiSun, HiMoon, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
          <span className="brand-icon">⚡</span>
          QuizMaster
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/" onClick={() => setMobileOpen(false)}>Quizzes</Link>
              <Link to="/random-quiz" onClick={() => setMobileOpen(false)}>Random Quiz</Link>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              {isAdmin && (
                <>
                  <Link to="/admin/quizzes" onClick={() => setMobileOpen(false)}>Manage</Link>
                  <Link to="/admin/analytics" onClick={() => setMobileOpen(false)}>Analytics</Link>
                </>
              )}
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                {isAdmin && <span className="admin-badge">Admin</span>}
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                {theme === 'dark' ? <HiSun size={20} /> : <HiMoon size={20} />}
              </button>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
