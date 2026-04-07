import { useLocation, Link, Navigate } from 'react-router-dom';
import { HiCheckCircle, HiXCircle } from 'react-icons/hi';

const QuizResult = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) return <Navigate to="/" replace />;

  const { result, quizTitle } = data;
  const { score, totalQuestions, percentage, results } = result;

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', emoji: '🏆', color: 'var(--color-success)' };
    if (percentage >= 70) return { label: 'Great Job!', emoji: '🌟', color: 'var(--color-primary)' };
    if (percentage >= 50) return { label: 'Good Effort!', emoji: '👍', color: 'var(--color-warning)' };
    return { label: 'Keep Trying!', emoji: '💪', color: 'var(--color-danger)' };
  };

  const grade = getGrade();

  return (
    <div className="page-container">
      <div className="result-card">
        <div className="result-header">
          <span className="result-emoji">{grade.emoji}</span>
          <h1>{grade.label}</h1>
          <p className="result-quiz-title">{quizTitle}</p>
        </div>

        <div className="result-score">
          <div className="score-circle" style={{ '--score-color': grade.color, '--score-pct': `${percentage}%` }}>
            <span className="score-number">{percentage}%</span>
          </div>
          <p className="score-detail">{score} out of {totalQuestions} correct</p>
        </div>

        <div className="result-actions">
          <Link to="/" className="btn btn-primary">Browse Quizzes</Link>
          <Link to="/dashboard" className="btn btn-outline">View Dashboard</Link>
        </div>
      </div>

      <div className="result-review">
        <h2>Answer Review</h2>
        <div className="review-list">
          {results.map((r, i) => (
            <div key={i} className={`review-item ${r.isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="review-header">
                <span className="review-number">Q{i + 1}</span>
                {r.isCorrect ? <HiCheckCircle className="review-icon correct" /> : <HiXCircle className="review-icon incorrect" />}
              </div>
              <p className="review-question">{r.questionText}</p>
              <div className="review-options">
                {r.options.map((opt, j) => (
                  <div
                    key={j}
                    className={`review-option 
                      ${j === r.correctAnswer ? 'correct-answer' : ''} 
                      ${j === r.selectedOption && !r.isCorrect ? 'wrong-answer' : ''}
                      ${j === r.selectedOption && r.isCorrect ? 'correct-answer' : ''}`}
                  >
                    <span className="option-letter">{String.fromCharCode(65 + j)}</span>
                    {opt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
