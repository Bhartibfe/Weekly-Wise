import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AUTH_CONSTANTS } from './authConstants';

// Create Authentication Context
const AuthContext = createContext(null);

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    JSON.parse(localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_STATE)) || false
  );

  const [user, setUser] = useState(() => 
    JSON.parse(localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USER)) || null
  );

  const [error, setError] = useState(null);

  useEffect(() => {
    localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.AUTH_STATE, JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(user));
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const usersData = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USERS);
      const users = usersData ? JSON.parse(usersData) : [];

      const existingUser = users.find(u => u.email === credentials.email);

      if (existingUser) {
        if (existingUser.password === credentials.password) {
          setUser(existingUser);
          setIsAuthenticated(true);
          return { success: true, message: 'Login successful' };
        } else {
          return { success: false, message: 'Incorrect password' };
        }
      } else {
        const newUser = {
          email: credentials.email,
          password: credentials.password,
          profile: null,
          createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.USERS, JSON.stringify(users));
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true, message: 'Account created successfully' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    localStorage.clear();
  };

  const updateUserProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, profile: profileData };
      setUser(updatedUser);
      
      const usersData = localStorage.getItem(AUTH_CONSTANTS.STORAGE_KEYS.USERS);
      const users = usersData ? JSON.parse(usersData) : [];
      const updatedUsers = users.map(u => 
        u.email === user.email ? updatedUser : u
      );
      
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      localStorage.setItem(AUTH_CONSTANTS.STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
    }
  };

  const contextValue = { 
    isAuthenticated, 
    user, 
    login, 
    logout,
    updateUserProfile,
    error 
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom Hook for Authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;