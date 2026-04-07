import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { HiRefresh, HiClock, HiChevronLeft, HiChevronRight, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const decodeHtml = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const RandomQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('medium');
  const [amount, setAmount] = useState(10);

  const fetchQuestions = async () => {
    setLoading(true);
    setFinished(false);
    setStarted(false);
    setAnswers({});
    setCurrentQ(0);
    setScore(0);
    try {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`
      );
      const data = await res.json();
      if (data.response_code !== 0 || !data.results.length) {
        toast.error('Failed to fetch questions. Try again.');
        setLoading(false);
        return;
      }
      const processed = data.results.map((q) => {
        const options = shuffleArray([...q.incorrect_answers, q.correct_answer].map(decodeHtml));
        return {
          questionText: decodeHtml(q.question),
          category: decodeHtml(q.category),
          options,
          correctAnswer: options.indexOf(decodeHtml(q.correct_answer))
        };
      });
      setQuestions(processed);
      setTimeLeft(amount * 30);
    } catch {
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = useCallback(() => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) s++;
    });
    setScore(s);
    setFinished(true);
    setStarted(false);
  }, [questions, answers]);

  useEffect(() => {
    if (!started || timeLeft <= 0) return;
    if (timeLeft === 1) {
      toast.error('Time is up!');
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started, handleSubmit]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Settings screen
  if (questions.length === 0 && !loading) {
    return (
      <div className="page-container">
        <div className="quiz-start-card">
          <span className="auth-icon">🎲</span>
          <h1>Random Quiz</h1>
          <p className="quiz-start-desc">Powered by Open Trivia Database. Questions are fetched live and not saved.</p>
          <div className="random-settings">
            <div className="setting-group">
              <label>Number of Questions</label>
              <select value={amount} onChange={e => setAmount(Number(e.target.value))}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Difficulty</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={fetchQuestions} disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : 'Generate Quiz 🎲'}
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  // Results screen
  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="page-container">
        <div className="result-card">
          <div className="result-header">
            <span className="result-emoji">{pct >= 70 ? '🌟' : pct >= 50 ? '👍' : '💪'}</span>
            <h1>{pct >= 70 ? 'Great Job!' : pct >= 50 ? 'Good Effort!' : 'Keep Trying!'}</h1>
            <p className="result-quiz-title">Random Quiz · {difficulty}</p>
          </div>
          <div className="result-score">
            <div className="score-circle" style={{ '--score-color': pct >= 70 ? 'var(--color-success)' : 'var(--color-warning)', '--score-pct': `${pct}%` }}>
              <span className="score-number">{pct}%</span>
            </div>
            <p className="score-detail">{score} out of {questions.length} correct</p>
          </div>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={() => { setQuestions([]); }}>
              <HiRefresh /> New Quiz
            </button>
          </div>
        </div>

        <div className="result-review">
          <h2>Answer Review</h2>
          <div className="review-list">
            {questions.map((q, i) => (
              <div key={i} className={`review-item ${answers[i] === q.correctAnswer ? 'correct' : 'incorrect'}`}>
                <div className="review-header">
                  <span className="review-number">Q{i + 1}</span>
                  {answers[i] === q.correctAnswer
                    ? <HiCheckCircle className="review-icon correct" />
                    : <HiXCircle className="review-icon incorrect" />}
                </div>
                <p className="review-question">{q.questionText}</p>
                <div className="review-options">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`review-option 
                        ${j === q.correctAnswer ? 'correct-answer' : ''} 
                        ${j === answers[i] && j !== q.correctAnswer ? 'wrong-answer' : ''}`}
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
  }

  // Pre-start
  if (!started) {
    return (
      <div className="page-container">
        <div className="quiz-start-card">
          <h1>Random Quiz</h1>
          <p className="quiz-start-desc">{questions.length} questions · {difficulty} difficulty</p>
          <div className="quiz-start-info">
            <div className="info-item">
              <span className="info-label">Questions</span>
              <span className="info-value">{questions.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Limit</span>
              <span className="info-value">{formatTimer(timeLeft)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Difficulty</span>
              <span className="info-value" style={{ textTransform: 'capitalize' }}>{difficulty}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)}>
            Start Quiz 🚀
          </button>
        </div>
      </div>
    );
  }

  // Playing
  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="page-container">
      <div className="quiz-play-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">Question {currentQ + 1} of {questions.length}</span>
        </div>
        <div className={`timer ${timeLeft <= 30 ? 'danger' : timeLeft <= 60 ? 'warning' : ''}`}>
          <HiClock />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      <div className="question-card">
        <span className="question-category-badge">{question.category}</span>
        <h2 className="question-text">{question.questionText}</h2>
        <div className="options-grid">
          {question.options.map((option, i) => (
            <button
              key={i}
              className={`option-btn ${answers[currentQ] === i ? 'selected' : ''}`}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQ]: i }))}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{option}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-nav">
        <button className="btn btn-outline" onClick={() => setCurrentQ(q => q - 1)} disabled={currentQ === 0}>
          <HiChevronLeft /> Previous
        </button>
        <div className="question-dots">
          {questions.map((_, i) => (
            <button key={i} className={`dot ${i === currentQ ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`} onClick={() => setCurrentQ(i)} />
          ))}
        </div>
        {currentQ === questions.length - 1 ? (
          <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrentQ(q => q + 1)}>
            Next <HiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default RandomQuiz;
