/**
 * @file api.js
 * Typed HTTP client orchestrating REST requests to PlanCraft AI backend.
 * Automatically injects the client-side session UUID for strict data isolation.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Session ID request interceptor
api.interceptors.request.use((config) => {
  const sessionId = localStorage.getItem('plancraft_session_id');
  if (sessionId) {
    config.headers['X-Session-Id'] = sessionId;
  }
  return config;
});

/**
 * Event orchestration service wrapping CRUD and GenAI endpoints.
 */
export const eventService = {
  /**
   * Fetches all events associated with current session.
   * @returns {Promise<{ events: Array<Object> }>}
   */
  list: () => api.get('/events').then((r) => r.data),

  /**
   * Retrieves single event details with computed analytics summary.
   * @param {string} id - Event ID
   * @returns {Promise<{ event: Object }>}
   */
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),

  /**
   * Creates a manual event record.
   * @param {Object} data - Event parameters
   * @returns {Promise<{ event: Object }>}
   */
  create: (data) => api.post('/events', data).then((r) => r.data),

  /**
   * Synthesizes a complete event blueprint via Gemini 2.5 Flash.
   * @param {Object} data - Input specification
   * @returns {Promise<{ event: Object, aiStatus: string, message: string }>}
   */
  generatePlan: (data) => api.post('/events/generate-plan', data).then((r) => r.data),

  /**
   * Updates core event details.
   * @param {string} id - Event ID
   * @param {Object} data - Updated fields
   * @returns {Promise<{ event: Object }>}
   */
  update: (id, data) => api.put(`/events/${id}`, data).then((r) => r.data),

  /**
   * Deletes an event and cascades to all child items.
   * @param {string} id - Event ID
   * @returns {Promise<{ success: boolean }>}
   */
  delete: (id) => api.delete(`/events/${id}`).then((r) => r.data),

  // ================= Budget =================

  /**
   * Adds an expense item to the event budget.
   * @param {string} eventId
   * @param {Object} data
   * @returns {Promise<{ item: Object }>}
   */
  addBudgetItem: (eventId, data) =>
    api.post(`/budget/events/${eventId}/budget`, data).then((r) => r.data),

  /**
   * Updates an existing budget item quote or status.
   * @param {string} itemId
   * @param {Object} data
   * @returns {Promise<{ item: Object }>}
   */
  updateBudgetItem: (itemId, data) => api.put(`/budget/${itemId}`, data).then((r) => r.data),

  /**
   * Removes a budget item.
   * @param {string} itemId
   * @returns {Promise<{ success: boolean }>}
   */
  deleteBudgetItem: (itemId) => api.delete(`/budget/${itemId}`).then((r) => r.data),

  // ================= Timeline =================

  /**
   * Adds a milestone to the event timeline.
   * @param {string} eventId
   * @param {Object} data
   * @returns {Promise<{ item: Object }>}
   */
  addTimelineItem: (eventId, data) =>
    api.post(`/timeline/events/${eventId}/timeline`, data).then((r) => r.data),

  /**
   * Modifies an existing timeline milestone.
   * @param {string} itemId
   * @param {Object} data
   * @returns {Promise<{ item: Object }>}
   */
  updateTimelineItem: (itemId, data) => api.put(`/timeline/${itemId}`, data).then((r) => r.data),

  /**
   * Toggles milestone completion state.
   * @param {string} itemId
   * @returns {Promise<{ item: Object }>}
   */
  toggleTimeline: (itemId) => api.patch(`/timeline/${itemId}/toggle`).then((r) => r.data),

  /**
   * Removes a milestone.
   * @param {string} itemId
   * @returns {Promise<{ success: boolean }>}
   */
  deleteTimelineItem: (itemId) => api.delete(`/timeline/${itemId}`).then((r) => r.data),

  // ================= Vendors =================

  /**
   * Adds a vendor to the pipeline.
   * @param {string} eventId
   * @param {Object} data
   * @returns {Promise<{ item: Object }>}
   */
  addVendorItem: (eventId, data) =>
    api.post(`/vendors/events/${eventId}/vendors`, data).then((r) => r.data),

  /**
   * Updates vendor details, status, or quotes.
   * @param {string} itemId
   * @param {Object} data
   * @returns {Promise<{ item: Object }>}
   */
  updateVendorItem: (itemId, data) => api.put(`/vendors/${itemId}`, data).then((r) => r.data),

  /**
   * Removes a vendor from the pipeline.
   * @param {string} itemId
   * @returns {Promise<{ success: boolean }>}
   */
  deleteVendorItem: (itemId) => api.delete(`/vendors/${itemId}`).then((r) => r.data),

  // ================= AI Consult & Ideas =================

  /**
   * Inquires with AI Planning Co-Pilot for contextual recommendations.
   * @param {string} eventId
   * @param {string} query
   * @returns {Promise<{ consultation: Object, aiStatus: string }>}
   */
  consultAi: (eventId, query) =>
    api.post(`/events/${eventId}/ai-consult`, { query }).then((r) => r.data),

  /**
   * Generates additional creative ideas tailored to event state.
   * @param {string} eventId
   * @returns {Promise<{ ideas: Array<Object>, aiStatus: string }>}
   */
  generateMoreIdeas: (eventId) => api.post(`/events/${eventId}/more-ideas`).then((r) => r.data),

  /**
   * Adds a bespoke personalized idea.
   * @param {string} eventId
   * @param {Object} data
   * @returns {Promise<{ idea: Object }>}
   */
  addIdea: (eventId, data) => api.post(`/ai/events/${eventId}/ideas`, data).then((r) => r.data),

  /**
   * Deletes a personalized idea.
   * @param {string} itemId
   * @returns {Promise<{ success: boolean }>}
   */
  deleteIdea: (itemId) => api.delete(`/ai/ideas/${itemId}`).then((r) => r.data)
};

export default api;
