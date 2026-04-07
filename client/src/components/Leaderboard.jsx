import { HiTrophy } from 'react-icons/hi2';

const Leaderboard = ({ data, currentUserId }) => {
  if (!data || data.length === 0) {
    return <p className="empty-state">No leaderboard data yet. Be the first to take a quiz!</p>;
  }

  const getMedalEmoji = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <HiTrophy size={24} />
        <h3>Leaderboard</h3>
      </div>
      <div className="leaderboard-list">
        {data.map((entry, index) => (
          <div
            key={entry.userId}
            className={`leaderboard-item ${currentUserId === entry.userId ? 'current-user' : ''} ${index < 3 ? 'top-three' : ''}`}
          >
            <span className="rank">{getMedalEmoji(index)}</span>
            <div className="player-info">
              <span className="player-name">{entry.name}</span>
              <span className="player-stats">{entry.totalAttempts} quizzes · avg {entry.avgPercentage}%</span>
            </div>
            <div className="player-score">
              <span className="score-value">{entry.bestPercentage}%</span>
              <span className="score-label">best</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
