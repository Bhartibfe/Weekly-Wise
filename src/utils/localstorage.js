// utils/LocalStorage.js

// Generic save function
export const saveToLocalStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  };
  
  // Generic load function
  export const loadFromLocalStorage = (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  };
  
  // Blog-specific functions
  export const saveBlog = (blog) => {
    const blogs = loadFromLocalStorage('blogs', []);
    const existingBlogIndex = blogs.findIndex(b => b.id === blog.id);
    
    if (existingBlogIndex >= 0) {
      blogs[existingBlogIndex] = blog;
    } else {
      blogs.push(blog);
    }
    
    return saveToLocalStorage('blogs', blogs);
  };
  
  export const deleteBlog = (blogId) => {
    const blogs = loadFromLocalStorage('blogs', []);
    const filteredBlogs = blogs.filter(blog => blog.id !== blogId);
    return saveToLocalStorage('blogs', filteredBlogs);
  };
  
  export const toggleBlogLike = (blogId) => {
    const blogs = loadFromLocalStorage('blogs', []);
    const updatedBlogs = blogs.map(blog =>
      blog.id === blogId ? { ...blog, isLiked: !blog.isLiked } : blog
    );
    return saveToLocalStorage('blogs', updatedBlogs);
  };
  
  export const toggleBlogPin = (blogId) => {
    const blogs = loadFromLocalStorage('blogs', []);
    const updatedBlogs = blogs.map(blog =>
      blog.id === blogId ? { ...blog, isPinned: !blog.isPinned } : blog
    );
    return saveToLocalStorage('blogs', updatedBlogs);
  };
  
  // User-specific functions
  export const saveUser = (user) => {
    return saveToLocalStorage('user', user);
  };
  
  export const loadUser = () => {
    return loadFromLocalStorage('user');
  };
  
  export const saveUserProfile = (profile) => {
    return saveToLocalStorage('userProfile', profile);
  };
  
  export const loadUserProfile = () => {
    return loadFromLocalStorage('userProfile');
  };
  
  export const saveUsers = (users) => {
    return saveToLocalStorage('users', users);
  };
  
  export const loadUsers = () => {
    return loadFromLocalStorage('users', []);
  };
  
  // Auth-specific functions
  export const saveAuthState = (isAuthenticated) => {
    return saveToLocalStorage('isAuthenticated', isAuthenticated);
  };
  
  export const loadAuthState = () => {
    return loadFromLocalStorage('isAuthenticated', false);
  };
  
  // Preferences functions
  export const saveSortPreference = (sortOption) => {
    return saveToLocalStorage('blogSortPreference', sortOption);
  };
  
  export const loadSortPreference = () => {
    return loadFromLocalStorage('blogSortPreference');
  };
  
  // Clear all data
  export const clearAllData = () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  };