import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      const loginUrl = `${apiBase}/auth/login`;
      
      // Send both common key names so the backend accepts either format
      const payload = { email, password, userEmail: email, userPassword: password };
      
      console.log('🔐 AuthContext.login START');
      console.log('📍 URL:', loginUrl);
      console.log('📤 Payload:', payload);
      
      const resp = await axios.post(loginUrl, payload);
      
      console.log('✅ AuthContext.login SUCCESS');
      console.log('📥 Response:', resp.data);

      const authToken = resp.data?.token;
      const userData = resp.data?.user;

      // SECURITY NOTE: Role comes from backend (userData.role), not from user input.
      // The backend MUST verify credentials and return the authoritative role.
      if (authToken && userData) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('💾 Token and user stored in localStorage');
        return resp.data;
      }

      throw new Error('Invalid login response - missing token or user');
    } catch (err) {
      console.error('❌ AuthContext.login FAILED');
      console.error('📡 Error details:', err?.response?.data || err.message);
      const message = err?.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      // IMPORTANT: Do NOT send role from frontend. Backend assigns default role (e.g. STUDENT).
      const resp = await axios.post(`${apiBase}/auth/register`, {
        email,
        password,
        name,
      });

      const authToken = resp.data?.token;
      const userData = resp.data?.user;

      if (authToken && userData) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
        return resp.data;
      }

      throw new Error('Invalid registration response');
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  }, [user]);

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
