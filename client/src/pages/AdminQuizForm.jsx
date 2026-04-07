import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash } from 'react-icons/hi';

const emptyQuestion = { questionText: '', options: ['', '', '', ''], correctAnswer: 0 };

const AdminQuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('General');
  const [timeLimit, setTimeLimit] = useState(300);
  const [questions, setQuestions] = useState([{ ...emptyQuestion }]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const categories = ['General', 'Science', 'Technology', 'History', 'Math', 'Sports', 'Entertainment'];

  useEffect(() => {
    if (isEdit) {
      api.get(`/quizzes/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setDescription(res.data.description || '');
          setCategory(res.data.category);
          setTimeLimit(res.data.timeLimit);
          setQuestions(res.data.questions);
        })
        .catch(() => {
          toast.error('Failed to load quiz');
          navigate('/admin/quizzes');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const updateQuestion = (index, field, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateOption = (qIndex, oIndex, value) => {
    setQuestions(prev => {
      const updated = [...prev];
      const options = [...updated[qIndex].options];
      options[oIndex] = value;
      updated[qIndex] = { ...updated[qIndex], options };
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, { ...emptyQuestion, options: ['', '', '', ''] }]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.error('Quiz must have at least 1 question');
      return;
    }
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) { toast.error('Title is required'); return; }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText.trim()) { toast.error(`Question ${i + 1} text is required`); return; }
      if (q.options.some(o => !o.trim())) { toast.error(`All options for Q${i + 1} must be filled`); return; }
    }

    setLoading(true);
    try {
      const payload = { title, description, category, timeLimit: Number(timeLimit), questions };
      if (isEdit) {
        await api.put(`/quizzes/${id}`, payload);
        toast.success('Quiz updated!');
      } else {
        await api.post('/quizzes', payload);
        toast.success('Quiz created!');
      }
      navigate('/admin/quizzes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{isEdit ? 'Edit Quiz' : 'Create New Quiz'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-card">
          <h2>Quiz Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="quiz-title">Title *</label>
              <input id="quiz-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter quiz title" required />
            </div>
            <div className="form-group">
              <label htmlFor="quiz-category">Category</label>
              <select id="quiz-category" value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="quiz-time">Time Limit (seconds)</label>
              <input id="quiz-time" type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} min="30" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="quiz-desc">Description</label>
              <textarea id="quiz-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional description" rows="3" />
            </div>
          </div>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h2>Questions ({questions.length})</h2>
            <button type="button" className="btn btn-outline btn-sm" onClick={addQuestion}>
              <HiPlus /> Add Question
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="question-builder">
              <div className="question-builder-header">
                <span className="q-number">Question {qIdx + 1}</span>
                <button type="button" className="btn btn-danger btn-sm btn-icon" onClick={() => removeQuestion(qIdx)} title="Remove">
                  <HiTrash />
                </button>
              </div>
              <div className="form-group">
                <label>Question Text *</label>
                <input type="text" value={q.questionText} onChange={e => updateQuestion(qIdx, 'questionText', e.target.value)} placeholder="Enter question" required />
              </div>
              <div className="options-builder">
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} className="option-input-row">
                    <label className={`option-radio ${q.correctAnswer === oIdx ? 'correct' : ''}`}>
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correctAnswer === oIdx}
                        onChange={() => updateQuestion(qIdx, 'correctAnswer', oIdx)}
                      />
                      <span className="radio-label">{String.fromCharCode(65 + oIdx)}</span>
                    </label>
                    <input
                      type="text"
                      value={opt}
                      onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)}`}
                      required
                    />
                  </div>
                ))}
                <p className="option-hint">Select the radio button for the correct answer</p>
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/quizzes')}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner-sm"></span> : (isEdit ? 'Update Quiz' : 'Create Quiz')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminQuizForm;
