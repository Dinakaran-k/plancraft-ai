import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('plancraft_session_id');
  if (sessionId) {
    config.headers['X-Session-Id'] = sessionId;
  }
  return config;
});

export const eventService = {
  list: () => api.get('/events').then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (data) => api.post('/events', data).then((r) => r.data),
  generatePlan: (data) => api.post('/events/generate-plan', data).then((r) => r.data),
  update: (id, data) => api.put(`/events/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/events/${id}`).then((r) => r.data),

  // Budget
  addBudgetItem: (eventId, data) => api.post(`/budget/events/${eventId}/budget`, data).then((r) => r.data),
  updateBudgetItem: (itemId, data) => api.put(`/budget/${itemId}`, data).then((r) => r.data),
  deleteBudgetItem: (itemId) => api.delete(`/budget/${itemId}`).then((r) => r.data),

  // Timeline
  addTimelineItem: (eventId, data) => api.post(`/timeline/events/${eventId}/timeline`, data).then((r) => r.data),
  updateTimelineItem: (itemId, data) => api.put(`/timeline/${itemId}`, data).then((r) => r.data),
  toggleTimeline: (itemId) => api.patch(`/timeline/${itemId}/toggle`).then((r) => r.data),
  deleteTimelineItem: (itemId) => api.delete(`/timeline/${itemId}`).then((r) => r.data),

  // Vendors
  addVendorItem: (eventId, data) => api.post(`/vendors/events/${eventId}/vendors`, data).then((r) => r.data),
  updateVendorItem: (itemId, data) => api.put(`/vendors/${itemId}`, data).then((r) => r.data),
  deleteVendorItem: (itemId) => api.delete(`/vendors/${itemId}`).then((r) => r.data),

  // AI Consult & Ideas
  consultAi: (eventId, query) => api.post(`/events/${eventId}/ai-consult`, { query }).then((r) => r.data),
  generateMoreIdeas: (eventId) => api.post(`/events/${eventId}/more-ideas`).then((r) => r.data),
  addIdea: (eventId, data) => api.post(`/ai/events/${eventId}/ideas`, data).then((r) => r.data),
  deleteIdea: (itemId) => api.delete(`/ai/ideas/${itemId}`).then((r) => r.data)
};

export default api;
