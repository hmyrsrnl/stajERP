import axios from 'axios';

const API_BASE_URL = 'http://172.16.154.0/stajERP/backend';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;