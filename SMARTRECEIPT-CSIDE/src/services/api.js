// client/src/services/api.js
import axios from 'axios';
import userService from './user';

const api = axios.create({
    
  baseURL: 'http://localhost:5000/api', // Update with your server's URL
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
});

export default api;