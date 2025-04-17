// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    username: '',
  }),
  actions: {
    checkUserStatus() {
      const tokenExists = document.cookie.split('; ').some(cookie => cookie.startsWith('token='));
      const userRole = localStorage.getItem('userRole');
      const username = localStorage.getItem('username');

      this.isLoggedIn = tokenExists;
      this.isAdmin = userRole === '1';
      this.username = username || '';
    },
    logout() {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      localStorage.removeItem('userRole');
      localStorage.removeItem('username');
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.username = '';
    }
  }
});