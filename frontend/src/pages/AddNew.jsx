import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createArticle, getArticleById, updateArticle } from '../api/articleApi';

function AddNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit) {
      setFetchLoading(true);
      getArticleById(id)
        .then((data) => {
          setForm({
            title: data.title || '',
            content: data.content || '',
            category: data.category || '',
          });
        })
        .catch(() => {
          showToast('Failed to load article', 'error');
        })
        .finally(() => setFetchLoading(false));
    }
  }, [id, isEdit]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (status) => {
    // Client-side validation
    if (form.title.trim().length < 20) {
      showToast('Title must be at least 20 characters', 'error');
      return;
    }
    if (form.content.trim().length < 200) {
      showToast('Content must be at least 200 characters', 'error');
      return;
    }
    if (form.category.trim().length < 3) {
      showToast('Category must be at least 3 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        category: form.category,
        status: status,
      };

      if (isEdit) {
        await updateArticle(id, payload);
        showToast('Article updated successfully!');
      } else {
        await createArticle(payload);
        showToast('Article created successfully!');
      }

      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      const errMsg =
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.error ||
        'Something went wrong';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.message}
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <h2>{isEdit ? 'Edit Article' : 'Add New Article'}</h2>
        <p>{isEdit ? 'Update your article details' : 'Create a new article for your blog'}</p>
      </div>

      {/* Form */}
      <div className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="title">Title</label>
          <input
            id="title"
            className="form-input"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter article title (min. 20 characters)"
            maxLength={200}
          />
          <div className={`char-count ${form.title.trim().length >= 20 ? 'valid' : 'invalid'}`}>
            {form.title.trim().length}/20 min
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="content">Content</label>
          <textarea
            id="content"
            className="form-textarea"
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Write your article content here (min. 200 characters)"
          />
          <div className={`char-count ${form.content.trim().length >= 200 ? 'valid' : 'invalid'}`}>
            {form.content.trim().length}/200 min
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="category">Category</label>
          <input
            id="category"
            className="form-input"
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. Technology, Business, Lifestyle"
            maxLength={100}
          />
          <div className={`char-count ${form.category.trim().length >= 3 ? 'valid' : 'invalid'}`}>
            {form.category.trim().length}/3 min
          </div>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={() => handleSubmit('publish')}
            disabled={loading}
          >
            {loading ? '...' : '🚀'} Publish
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleSubmit('draft')}
            disabled={loading}
          >
            {loading ? '...' : '📝'} Draft
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNew;
