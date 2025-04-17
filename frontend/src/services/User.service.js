// src/services/user.service.js

// efetch function for making fetch calls with consistent error handling
/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<any>
 */
async function efetch(url, options = {}) {
  let result;
  let json;
  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error('Network error: ' + error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message || 'Unknown error occurred');
  }
  return json.data;
}

// Base URL for API
// const API_URL = "http://localhost:3000"; // Replace with your actual backend URL

const UserService = {
  // Create a new user account
  async createAccount(phoneNumber, username, password, confirmPassword) {
    const url = `/api/user`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber, username, password, confirmPassword })
    };
    return await efetch(url, options);
  },

  // Change user password
  async changeUserPassword(userId, oldPassword, newPassword, confirmNewPassword) {
    const url = `/api/user/${userId}/password`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ oldPassword, newPassword, confirmNewPassword })
    };
    return await efetch(url, options);
  },

  // User login
  async login(username, password) {
    const url = `/api/user/login`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    };
    const data = await efetch(url, options);

    // Save token in local storage if login is successful
    if (data.token) {
      localStorage.setItem('userToken', data.token);
    }
    return data;
  },

  // User logout
  async logout() {
    const url = `/api/user/logout`;
    const options = { method: 'POST' };
    const data = await efetch(url, options);

    // Remove token from local storage on logout
    localStorage.removeItem('userToken');
    return data;
  },

  // Check if the user is logged in by checking the presence of a token
  isLoggedIn() {
    return !!localStorage.getItem('userToken');
  },

  // Get user info from the stored JWT token
  getUserInfo() {
    const token = localStorage.getItem('userToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { username: payload.username, role: payload.role };
    } catch {
      return null;
    }
  }
};

export default UserService;
