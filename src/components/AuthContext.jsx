// AuthContext.jsx updates

import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  loadUser,
  saveUser,
  loadUsers,
  saveUsers,
  loadAuthState,
  saveAuthState,
  clearAllData
} from '../utils/LocalStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => loadAuthState());
  const [user, setUser] = useState(() => loadUser());
  const [error, setError] = useState(null);

  useEffect(() => {
    saveAuthState(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      saveUser(user);
    }
  }, [user]);

  const login = async (credentials) => {
    try {
      const users = loadUsers();
      const existingUser = users.find(u => u.email === credentials.email);

      if (existingUser) {
        if (existingUser.password === credentials.password) {
          setUser(existingUser);
          setIsAuthenticated(true);
          saveUser(existingUser);
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
        saveUsers(users);
        saveUser(newUser);
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
    clearAllData(); // Clear all data on logout
  };

  const updateUserProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, profile: profileData };
      setUser(updatedUser);
      saveUser(updatedUser);
      
      const users = loadUsers();
      const updatedUsers = users.map(u => 
        u.email === user.email ? updatedUser : u
      );
      saveUsers(updatedUsers);
    }
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout,
      updateUserProfile,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);