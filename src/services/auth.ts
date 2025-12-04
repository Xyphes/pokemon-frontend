import type {User} from '../types/user';

const API_URL = 'http://localhost:3000'; // Replace with your backend URL

export const login = async (username: string, password: string): Promise<User> => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to login');
  }

  return response.json();
};

export const register = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  return response.json();
};
