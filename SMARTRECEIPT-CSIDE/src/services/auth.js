// client/src/services/auth.js
import api from './api';

const signUp = async (formData) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const signIn = async (formData) => {
  try {
    
    const response = await api.post('/auth/signin', formData);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { signUp, signIn };
