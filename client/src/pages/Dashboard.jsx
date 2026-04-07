import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Leaderboard from '../components/Leaderboard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiTrendingUp, HiClipboardCheck, HiStar } from 'react-icons/hi';

const Dashboard = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, lbRes] = await Promise.all([
          api.get('/attempts/my'),
          api.get('/dashboard/leaderboard')
        ]);
        setAttempts(attRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) {
        toast.error('Failed to load dashboard data');
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = {
    totalAttempts: attempts.length,
    avgScore: attempts.length
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0,
    bestScore: attempts.length
      ? Math.max(...attempts.map(a => a.percentage))
      : 0
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSkeleton count={3} type="card" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, {user?.name}! Here's your quiz performance.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
            <HiClipboardCheck size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAttempts}</span>
            <span className="stat-label">Quizzes Taken</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
            <HiTrendingUp size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.avgScore}%</span>
            <span className="stat-label">Average Score</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-accent)' }}>
            <HiStar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.bestScore}%</span>
            <span className="stat-label">Best Score</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Score History</h2>
          {attempts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📊</span>
              <p>No attempts yet. Take a quiz to see your history!</p>
            </div>
          ) : (
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Quiz</th>
                    <th>Category</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map(a => (
                    <tr key={a._id}>
                      <td>{a.quiz?.title || 'Deleted Quiz'}</td>
                      <td><span className="category-badge">{a.quiz?.category || '—'}</span></td>
                      <td>{a.score}/{a.totalQuestions}</td>
                      <td>
                        <span className={`pct-badge ${a.percentage >= 70 ? 'high' : a.percentage >= 50 ? 'mid' : 'low'}`}>
                          {a.percentage}%
                        </span>
                      </td>
                      <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <Leaderboard data={leaderboard} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
