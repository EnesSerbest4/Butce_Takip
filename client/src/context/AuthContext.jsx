import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const login = async (email, sifre) => {
    const response = await api.post('/auth/login', { email, sifre });
    const { token: gelenToken, user: gelenUser } = response.data;

    localStorage.setItem('token', gelenToken);
    localStorage.setItem('user', JSON.stringify(gelenUser || { email }));
    setToken(gelenToken);
    setUser(gelenUser || { email });
    return response.data;
  };

  const register = async (adSoyad, email, sifre) => {
    const response = await api.post('/auth/register', { adSoyad, email, sifre });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);