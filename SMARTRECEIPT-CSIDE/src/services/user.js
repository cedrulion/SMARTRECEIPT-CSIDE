// src/services/user.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000'; // Update with your backend API base URL

const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api/users`, // Update the path based on your API structure
});

const userService = {
  // Fetch user by ID
  getUserById: async (userId) => {
    try {
      const response = await userApi.get(`/${userId}`);
      return response.data;
      
    } catch (error) {
      throw error;
    }
  },

  // Fetch a list of all users
  getAllUsers: async () => {
    try {
      const response = await userApi.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, updatedUserData) => {
    try {
      const response = await userApi.put(`/${userId}`, updatedUserData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user by ID
  deleteUserById: async (userId) => {
    try {
      const response = await userApi.delete(`/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
