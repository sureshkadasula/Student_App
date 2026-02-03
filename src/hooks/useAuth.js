import { useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await AuthService.getSession();
        if (session && session.token) {
          setToken(session.token);
          setUser(session.user);
        }
      } catch (error) {
        console.error('Error loading session in useAuth:', error);
      }
    };
    loadSession();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      if (data && data.token) {
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error in useAuth:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AuthService.logout();
    setToken(null);
    setUser(null);
  };

  return { token, user, login, logout };
};

export default useAuth;