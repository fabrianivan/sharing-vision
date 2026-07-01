import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles, updateArticle, getArticleById } from '../api/articleApi';

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Publish');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { key: 'Publish', label: 'Published' },
    { key: 'Draft', label: 'Drafts' },
    { key: 'Thrash', label: 'Trashed' },
  ];

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles(200, 0);
      setPosts(data || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = posts.filter(
    (post) => post.status === activeTab
  );

  const tabCounts = {
    Publish: posts.filter((p) => p.status === 'Publish').length,
    Draft: posts.filter((p) => p.status === 'Draft').length,
    Thrash: posts.filter((p) => p.status === 'Thrash').length,
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTrash = async (post) => {
    try {
      // Fetch current article data first, then update status to Thrash
      const current = await getArticleById(post.id);
      await updateArticle(post.id, {
        title: current.title,
        content: current.content,
        category: current.category,
        status: 'thrash',
      });
      showToast('Article moved to trash');
      fetchPosts();
    } catch (error) {
      showToast('Failed to move article to trash', 'error');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

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
        <h2>All Posts</h2>
        <p>Manage your articles across all statuses</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="tab-badge">{tabCounts[tab.key]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No articles found</h3>
          <p>
            {activeTab === 'Publish'
              ? 'No published articles yet. Create your first one!'
              : activeTab === 'Draft'
              ? 'No drafts saved.'
              : 'Trash is empty.'}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="cell-title">{post.title}</td>
                  <td className="cell-category">{post.category}</td>
                  <td>
                    <div className="cell-actions">
                      <button
                        className="btn-action edit"
                        onClick={() => handleEdit(post.id)}
                        title="Edit article"
                      >
                        ✎
                      </button>
                      {activeTab !== 'Thrash' && (
                        <button
                          className="btn-action trash"
                          onClick={() => handleTrash(post)}
                          title="Move to trash"
                        >
                          🗑
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllPosts;
