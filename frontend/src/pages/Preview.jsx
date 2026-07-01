import { useState, useEffect, useCallback } from 'react';
import { getArticles } from '../api/articleApi';
import Pagination from '../components/Pagination';

const ITEMS_PER_PAGE = 6;

function Preview() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles(200, 0);
      // Filter only published articles
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

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPosts = posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <h2>Preview</h2>
        <p>Browse your published articles</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : paginatedPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📰</div>
          <h3>No published articles</h3>
          <p>Publish an article to see it here.</p>
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
