import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiClock, HiQuestionMarkCircle, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

const Home = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('All');

  const categories = ['All', 'General', 'Science', 'Technology', 'History', 'Math', 'Sports', 'Entertainment'];

  useEffect(() => {
    fetchQuizzes();
  }, [page, category]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category !== 'All') params.category = category;
      const res = await api.get('/quizzes', { params });
      setQuizzes(res.data.quizzes);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error('Failed to load quizzes');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Quizzes</h1>
        <p>Choose a quiz and test your knowledge</p>
      </div>

      <div className="category-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`category-chip ${category === cat ? 'active' : ''}`}
            onClick={() => { setCategory(cat); setPage(1); }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSkeleton count={6} type="card" />
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No quizzes available</h3>
          <p>Check back later for new quizzes!</p>
        </div>
      ) : (
        <>
          <div className="quiz-grid">
            {quizzes.map(quiz => (
              <Link to={`/quiz/${quiz._id}`} key={quiz._id} className="quiz-card">
                <div className="quiz-card-header">
                  <span className="quiz-category">{quiz.category}</span>
                </div>
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-desc">{quiz.description || 'No description'}</p>
                <div className="quiz-meta">
                  <span className="meta-item">
                    <HiQuestionMarkCircle />
                    {quiz.questionCount} questions
                  </span>
                  <span className="meta-item">
                    <HiClock />
                    {formatTime(quiz.timeLimit)}
                  </span>
                </div>
                <div className="quiz-card-action">Start Quiz →</div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <HiChevronLeft /> Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next <HiChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
