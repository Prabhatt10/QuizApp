import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiClock, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        setQuiz(res.data);
        setTimeLeft(res.data.timeLimit);
      } catch (err) {
        toast.error('Failed to load quiz');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, navigate]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const answersArray = quiz.questions.map((_, i) => answers[i] !== undefined ? answers[i] : -1);
      const res = await api.post('/attempts', { quizId: id, answers: answersArray });
      navigate('/quiz-result', { state: { result: res.data, quizTitle: quiz.title } });
    } catch (err) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  }, [submitting, quiz, answers, id, navigate]);

  useEffect(() => {
    if (!started || timeLeft <= 0 || submitting) return;
    if (timeLeft === 1) {
      toast.error('Time is up!');
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, started, submitting, handleSubmit]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 30) return 'timer danger';
    if (timeLeft <= 60) return 'timer warning';
    return 'timer';
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  if (!quiz) return null;

  if (!started) {
    return (
      <div className="page-container">
        <div className="quiz-start-card">
          <h1>{quiz.title}</h1>
          <p className="quiz-start-desc">{quiz.description}</p>
          <div className="quiz-start-info">
            <div className="info-item">
              <span className="info-label">Questions</span>
              <span className="info-value">{quiz.questions.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Time Limit</span>
              <span className="info-value">{formatTimer(quiz.timeLimit)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category</span>
              <span className="info-value">{quiz.category}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)}>
            Start Quiz 🚀
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="page-container">
      <div className="quiz-play-header">
        <div className="quiz-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">
            Question {currentQ + 1} of {quiz.questions.length}
          </span>
        </div>
        <div className={getTimerClass()}>
          <HiClock />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      <div className="question-card">
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
        <button
          className="btn btn-outline"
          onClick={() => setCurrentQ(q => q - 1)}
          disabled={currentQ === 0}
        >
          <HiChevronLeft /> Previous
        </button>

        <div className="question-dots">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentQ ? 'active' : ''} ${answers[i] !== undefined ? 'answered' : ''}`}
              onClick={() => setCurrentQ(i)}
            />
          ))}
        </div>

        {currentQ === quiz.questions.length - 1 ? (
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? <span className="spinner-sm"></span> : 'Submit Quiz'}
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setCurrentQ(q => q + 1)}
          >
            Next <HiChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPlay;
