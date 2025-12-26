// CourseManager - API Client & Utilities
const API_BASE = 'http://localhost:3000/api';

// API Client
const api = {
    // Helper for fetch requests
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = { 'Content-Type': 'application/json', ...options.headers };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
        return res.json();
    },

    // Auth
    register: (data) => api.request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data) => api.request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    getMe: () => api.request('/auth/me'),

    // Courses
    getCourses: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return api.request(`/courses${query ? '?' + query : ''}`);
    },
    getCourse: (id) => api.request(`/courses/${id}`),
    createCourse: (data) => api.request('/courses', { method: 'POST', body: JSON.stringify(data) }),
    updateCourse: (id, data) => api.request(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCourse: (id) => api.request(`/courses/${id}`, { method: 'DELETE' }),

    // Favorites
    addFavorite: (courseId) => api.request(`/favorites/${courseId}`, { method: 'POST' }),
    removeFavorite: (courseId) => api.request(`/favorites/${courseId}`, { method: 'DELETE' }),
    getMyFavorites: () => api.request('/favorites/my-favorites'),
    getMyFavoriteIds: () => api.request('/favorites/my-favorite-ids'),

    // Purchases
    purchaseCourse: (courseId) => api.request(`/purchases/${courseId}`, { method: 'POST' }),
    getMyPurchases: () => api.request('/purchases/my-purchases'),
    getMyPurchaseIds: () => api.request('/purchases/my-purchase-ids'),
    updateProgress: (courseId, progress) => api.request(`/purchases/${courseId}/progress`, { method: 'PUT', body: JSON.stringify({ progress }) }),

    // Users (Admin)
    getAllUsers: () => api.request('/users'),
    getMyRole: () => api.request('/users/my-role'),
    updateUserRole: (userId, role) => api.request(`/users/${userId}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),

    // Scraping (n8n)
    triggerScraping: (url, category) => api.request('/scraping/trigger', { method: 'POST', body: JSON.stringify({ url, category }) }),
    getScrapedData: (params = {}) => api.request('/scraping?' + new URLSearchParams(params)),
    getMyScrapedData: () => api.request('/scraping/my-data'),
    deleteScrapedData: (id) => api.request(`/scraping/${id}`, { method: 'DELETE' }),

    // Upload
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch(api.baseUrl + '/upload/image', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData
        });
        return response.json();
    }
};

// Toast Notification
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Debounce utility
function debounce(fn, ms) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
}

// Escape HTML for security
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}
