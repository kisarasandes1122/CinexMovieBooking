// Environment configuration
const environment = {
  development: {
    API_BASE_URL: 'http://localhost:3001/api',
    SOCKET_URL: 'http://localhost:3001',
  },
  production: {
    API_BASE_URL: 'https://your-production-api.com/api',
    SOCKET_URL: 'https://your-production-api.com',
  },
  staging: {
    API_BASE_URL: 'https://your-staging-api.com/api',
    SOCKET_URL: 'https://your-staging-api.com',
  }
};

// Get current environment from Vite's import.meta.env
const getCurrentEnv = () => {
  const mode = import.meta.env.MODE || 'development';
  return mode;
};

// Get configuration for current environment
const getConfig = () => {
  const currentEnv = getCurrentEnv();
  return environment[currentEnv] || environment.development;
};

export { getConfig, getCurrentEnv };
export default getConfig(); 