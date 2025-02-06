export const AUTH_CONSTANTS = {
    STORAGE_KEYS: {
      USER: 'user',
      USERS: 'users',
      AUTH_STATE: 'isAuthenticated'
    }
  };
  
  export const createAuthContext = () => {
    return {
      isAuthenticated: false,
      user: null,
      login: async () => {},
      logout: () => {},
      updateUserProfile: () => {},
      error: null
    };
  };