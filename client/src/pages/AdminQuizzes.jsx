import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSkeleton from '../components/LoadingSkeleton';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiQuestionMarkCircle } from 'react-icons/hi';

const AdminQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuizzes();
  }, [page]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quizzes', { params: { page, limit: 10 } });
      setQuizzes(res.data.quizzes);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/quizzes/${id}`);
      toast.success('Quiz deleted');
      fetchQuizzes();
    } catch {
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Manage Quizzes</h1>
          <p>Create, edit and delete quizzes</p>
        </div>
        <Link to="/admin/quizzes/new" className="btn btn-primary">
          <HiPlus /> New Quiz
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : quizzes.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No quizzes yet</h3>
          <p>Create your first quiz to get started!</p>
          <Link to="/admin/quizzes/new" className="btn btn-primary">Create Quiz</Link>
        </div>
      ) : (
        <>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Questions</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map(q => (
                  <tr key={q._id}>
                    <td className="title-cell">{q.title}</td>
                    <td><span className="category-badge">{q.category}</span></td>
                    <td>
                      <span className="meta-item"><HiQuestionMarkCircle /> {q.questionCount}</span>
                    </td>
                    <td>{new Date(q.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/admin/quizzes/edit/${q._id}`} className="btn btn-outline btn-sm btn-icon" title="Edit">
                          <HiPencil />
                        </Link>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(q._id, q.title)} title="Delete">
                          <HiTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>Previous</button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button className="btn btn-outline btn-sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminQuizzes;
