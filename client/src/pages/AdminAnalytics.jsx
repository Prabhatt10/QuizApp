import { useState, useEffect } from 'react';
import api from '../api/axios';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiUsers, HiCollection, HiClipboardCheck, HiChartBar } from 'react-icons/hi';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/admin-stats');
        setStats(res.data);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSkeleton count={4} type="card" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Admin Analytics</h1>
        <p>Platform overview and statistics</p>
      </div>

      <div className="stats-grid four-col">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-primary)' }}>
            <HiUsers size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalUsers}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-secondary)' }}>
            <HiCollection size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalQuizzes}</span>
            <span className="stat-label">Total Quizzes</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--gradient-accent)' }}>
            <HiClipboardCheck size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.totalAttempts}</span>
            <span className="stat-label">Total Attempts</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            <HiChartBar size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{stats.categoryStats?.length || 0}</span>
            <span className="stat-label">Categories</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Categories Breakdown</h2>
          {stats.categoryStats && stats.categoryStats.length > 0 ? (
            <div className="category-breakdown">
              {stats.categoryStats.map(cat => (
                <div key={cat._id} className="breakdown-item">
                  <span className="breakdown-label">{cat._id}</span>
                  <div className="breakdown-bar-container">
                    <div
                      className="breakdown-bar"
                      style={{ width: `${(cat.count / Math.max(...stats.categoryStats.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="breakdown-count">{cat.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No categories yet</p>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Recent Attempts</h2>
          {stats.recentAttempts && stats.recentAttempts.length > 0 ? (
            <div className="recent-list">
              {stats.recentAttempts.map(a => (
                <div key={a._id} className="recent-item">
                  <div className="recent-info">
                    <span className="recent-user">{a.user?.name || 'Unknown'}</span>
                    <span className="recent-quiz">{a.quiz?.title || 'Deleted Quiz'}</span>
                  </div>
                  <div className="recent-meta">
                    <span className={`pct-badge ${a.percentage >= 70 ? 'high' : a.percentage >= 50 ? 'mid' : 'low'}`}>
                      {a.percentage}%
                    </span>
                    <span className="recent-date">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No attempts yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
