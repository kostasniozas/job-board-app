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
  },

  // Παίρνει τον τρέχοντα χρήστη με όλες τις πληροφορίες
  getCurrentUser: async () => {
    return apiCall('/auth/me');
  },

  // Ενημερώνει το προφίλ του χρήστη
  updateProfile: async (profileData) => {
    return apiCall('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Έλεγχος αν είναι συνδεδεμένος
  checkAuth: async () => {
    return apiCall('/auth/check');
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

  // Κλείσιμο αγγελίας (αλλαγή status σε 'closed')
  closeJob: async (jobId) => {
    return apiCall(`/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'closed' }),
    });
  },

  // Λεπτομέρειες συγκεκριμένης αγγελίας
  getJobById: async (jobId) => {
    return apiCall(`/jobs/${jobId}`);
  }
};

// APPLICATIONS API CALLS
export const applicationsAPI = {
  // Όλες οι αιτήσεις για τον συνδεδεμένο employer
  getEmployerApplications: async () => {
    return apiCall('/applications/employer');
  },

  // Αιτήσεις για συγκεκριμένο job
  getJobApplications: async (jobId) => {
    return apiCall(`/applications/job/${jobId}`);
  },

  // Δημιουργία νέας αίτησης (για job seekers)
  submitApplication: async (applicationData) => {
    return apiCall('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  // Ενημέρωση status αίτησης (approve/reject)
  updateApplicationStatus: async (applicationId, status) => {
    return apiCall(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Rating candidate
  rateCandidate: async (applicationId, rating) => {
    return apiCall(`/applications/${applicationId}/rating`, {
      method: 'PUT',
      body: JSON.stringify({ rating }),
    });
  },

  // Αποστολή interview questions
  sendInterviewQuestions: async (applicationId, questions) => {
    return apiCall(`/applications/${applicationId}/interview`, {
      method: 'POST',
      body: JSON.stringify({ questions }),
    });
  }
};