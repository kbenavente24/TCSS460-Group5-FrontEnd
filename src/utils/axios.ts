import axios, { AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// ==============================|| ENVIRONMENT VALIDATION ||============================== //

// Use defaults for development, but log warnings
const getCredentialsApiUrl = () => {
  const url = process.env.CREDENTIALS_API_URL || process.env.NEXT_PUBLIC_CREDENTIALS_API_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ CREDENTIALS_API_URL environment variable is not set. ' +
          'Using placeholder. Please add CREDENTIALS_API_URL to your .env.local file. ' +
          'Example: CREDENTIALS_API_URL=http://localhost:8008'
      );
      return 'http://localhost:8008'; // Default for development
    }
    throw new Error(
      'CREDENTIALS_API_URL environment variable is not set. ' +
        'Please add CREDENTIALS_API_URL to your .env and/or next.config.js file(s). ' +
        'Example: CREDENTIALS_API_URL=http://localhost:8008'
    );
  }
  return url;
};

const getMessagesApiUrl = () => {
  const url = process.env.MESSAGES_WEB_API_URL || process.env.NEXT_PUBLIC_MESSAGES_WEB_API_URL;
  if (!url) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ MESSAGES_WEB_API_URL environment variable is not set. ' +
          'Using placeholder. Please add MESSAGES_WEB_API_URL to your .env.local file. ' +
          'Example: MESSAGES_WEB_API_URL=http://localhost:8000'
      );
      return 'http://localhost:8000'; // Default for development
    }
    throw new Error(
      'MESSAGES_WEB_API_URL environment variable is not set. ' +
        'Please add MESSAGES_WEB_API_URL to your .env and/or next.config.js file(s). ' +
        'Example: MESSAGES_WEB_API_URL=http://localhost:8000'
    );
  }
  return url;
};

const getMessagesApiKey = () => {
  const key = process.env.MESSAGES_WEB_API_KEY || process.env.NEXT_PUBLIC_MESSAGES_WEB_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '⚠️ MESSAGES_WEB_API_KEY environment variable is not set. ' +
          'Using placeholder. Please add MESSAGES_WEB_API_KEY to your .env.local file. ' +
          'Example: MESSAGES_WEB_API_KEY=your-api-key-here'
      );
      return 'dev-api-key-placeholder'; // Default for development
    }
    throw new Error(
      'MESSAGES_WEB_API_KEY environment variable is not set. ' +
        'Please add MESSAGES_WEB_API_KEY to your .env and/or next.config.js file(s). ' +
        'Example: MESSAGES_WEB_API_KEY=your-api-key-here'
    );
  }
  return key;
};

// ==============================|| CREDENTIALS SERVICE ||============================== //

const credentialsService = axios.create({ baseURL: getCredentialsApiUrl() });

credentialsService.interceptors.request.use(
  async (config) => {
    // Only attach token for protected endpoints (not login/register)
    if (!config.url?.includes('/auth/register') && !config.url?.includes('/auth/login')) {
      const session = await getSession();
      if (session?.token?.accessToken) {
        config.headers['Authorization'] = `Bearer ${session.token.accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

credentialsService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused to Auth/Web API:', error.config);
      return Promise.reject({ message: 'Connection refused.' });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    } else if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.href.includes('/login')) {
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| MESSAGES SERVICE ||============================== //

const messagesService = axios.create({ baseURL: getMessagesApiUrl() });

messagesService.interceptors.request.use(
  async (config) => {
    config.headers['X-API-Key'] = getMessagesApiKey();
    return config;
  },
  (error) => Promise.reject(error)
);

messagesService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused to Messages API:', error.config);
      return Promise.reject({ message: 'Connection refused.' });
    } else if (error.response?.status >= 500) {
      return Promise.reject({ message: 'Server Error. Contact support' });
    }
    return Promise.reject((error.response && error.response.data) || 'Server connection refused');
  }
);

// ==============================|| EXPORTS ||============================== //

export default credentialsService;
export { credentialsService, messagesService };

// ==============================|| HELPER FUNCTIONS ||============================== //

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.get(url, { ...config });
  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await credentialsService.post(url, { ...config });
  return res.data;
};

export const messagesFetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await messagesService.get(url, { ...config });
  return res.data;
};

export const messagesFetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];
  const res = await messagesService.post(url, { ...config });
  return res.data;
};
