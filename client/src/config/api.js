const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  API_PREFIX: '/api',

  get API_URL() {
    return `${this.API_BASE_URL}${this.API_PREFIX}`;
  },

  ENDPOINTS: {
    USERS: '/users',
    EVENTS: '/events',
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_ME: '/auth/me',
    AUTH_PROFILE: '/auth/profile',
    AUTH_CHANGE_PASSWORD: '/auth/change-password'
  },

  getEndpoint(endpoint) {
    return `${this.API_URL}${this.ENDPOINTS[endpoint]}`;
  }
};

export default CONFIG;
