import { useState, useEffect, useCallback } from 'react';
import { getArticles } from '../api/articleApi';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

function Preview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles(200, 0);
      const published = (data || []).filter((p) => p.status === 'Publish');
      setPosts(published);
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
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateReadTime = (content) => {
    const words = content ? content.trim().split(/\s+/).length : 0;
    const wpm = 200; // Average reading speed
    return Math.max(1, Math.round(words / wpm));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h2>Publication Preview</h2>
        <p>Explore all active, published articles in the feed</p>
      </div>

      {/* Search Input */}
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search published articles..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset page to 1 when searching
          }}
        />
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : paginatedPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{searchQuery ? '🔍' : '📰'}</div>
          <h3>{searchQuery ? 'No matching publications' : 'No articles published yet'}</h3>
          <p>{searchQuery ? `No articles match "${searchQuery}".` : 'Try publishing a draft first.'}</p>
        </div>
      ) : (
        <>
          <div className="blog-grid">
            {paginatedPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-card-header">
                  <span className="blog-card-category">{post.category}</span>
                  <span className="blog-card-date">{formatDate(post.created_date)}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="blog-card-content">{post.content}</p>
                <div className="blog-card-meta">
                  <div className="author-avatar">FI</div>
                  <div className="author-details">
                    <span className="author-name">Fabrian Ivan</span>
                    <span className="read-time">{calculateReadTime(post.content)} min read</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default Preview;

