import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a new article
export const createArticle = async (data) => {
  const response = await api.post('/article/', data);
  return response.data;
};

// Get paginated articles
export const getArticles = async (limit = 100, offset = 0) => {
  const response = await api.get(`/article/${limit}/${offset}`);
  return response.data;
};

// Get article by ID
export const getArticleById = async (id) => {
  const response = await api.get(`/article/${id}`);
  return response.data;
};

// Update article by ID
export const updateArticle = async (id, data) => {
  const response = await api.put(`/article/${id}`, data);
  return response.data;
};

// Delete article by ID
export const deleteArticle = async (id) => {
  const response = await api.delete(`/article/${id}`);
  return response.data;
};

export default api;
