// client/src/services/api.js
// API service για σύνδεση με backend

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function για όλα τα API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include', // Για cookies/sessions
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// AUTHENTICATION API CALLS
export const authAPI = {
  // Εγγραφή χρήστη
  register: async (userData) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Σύνδεση χρήστη
  login: async (credentials) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Αποσύνδεση
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  }
};

// JOBS API CALLS
export const jobsAPI = {
  // Όλες οι αγγελίες
  getAllJobs: async () => {
    return apiCall('/jobs');
  },

  // Δημιουργία αγγελίας
  createJob: async (jobData) => {
    return apiCall('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  // Αγγελίες του συνδεδεμένου εργοδότη
  getMyJobs: async () => {
    return apiCall('/jobs/my-jobs');
  },

  // Ενημέρωση αγγελίας
  updateJob: async (jobId, jobData) => {
    return apiCall(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  // Διαγραφή αγγελίας
  deleteJob: async (jobId) => {
    return apiCall(`/jobs/${jobId}`, {
      method: 'DELETE',
    });
  },

  // Λεπτομέρειες συγκεκριμένης αγγελίας
  getJobById: async (jobId) => {
    return apiCall(`/jobs/${jobId}`);
  }
};