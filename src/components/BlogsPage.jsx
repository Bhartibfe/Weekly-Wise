import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Home, PenTool, Heart } from 'lucide-react';
import BlogList from './BlogList';
import CreateBlog from './CreateBlog';
import BlogView from './BlogView';
import EditBlog from './EditBlog';
import LikedBlogs from './LikedBlogs';

const BlogsPage = () => {
  
  
  const [blogs, setBlogs] = useState(() => {
    const savedBlogs = localStorage.getItem('blogs');
    return savedBlogs ? JSON.parse(savedBlogs) : [
      {
        id: 1,
        title: "Welcome to Your Blog",
        content: "<p>This is your first blog post. Start writing your thoughts!</p>",
        date: new Date().toISOString(),
        isLiked: false,
        isPinned: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('blogs', JSON.stringify(blogs));
  }, [blogs]);

  const handleToggleLike = (id) => {
    console.log('Toggling like for blog:', id);
    setBlogs(prevBlogs => {
      const updatedBlogs = prevBlogs.map(blog => {
        if (blog.id === id) {
          console.log('Found blog to toggle, current isLiked:', blog.isLiked);
          return { ...blog, isLiked: !blog.isLiked };
        }
        return blog;
      });
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
      return updatedBlogs;
    });
  };
  const handleCreateBlog = (newBlog) => {
    const blogToAdd = {
      ...newBlog,
      id: Date.now(),
      date: new Date().toISOString(),
      isLiked: false,
      isPinned: false
    };
    setBlogs(prevBlogs => [...prevBlogs, blogToAdd]);
  };

  const handleUpdateBlog = (updatedBlog) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog.id === updatedBlog.id 
          ? { ...blog, ...updatedBlog, date: new Date().toISOString() } 
          : blog
      )
    );
  };

  const handleDeleteBlog = (id) => {
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
  };

  const handleTogglePin = (id) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === id ? { ...blog, isPinned: !blog.isPinned } : blog
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
       <header className="relative bg-gradient-to-r from-blue-50 to-indigo-50 text-black p-4">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
      
      {/* Geometric patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute transform rotate-45 bg-indigo-500 w-16 h-16 right-8 top-4" />
        <div className="absolute transform rotate-45 bg-blue-500 w-8 h-8 right-4 top-8" />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative">
          <h1 className="text-2xl ">
          </h1>
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 transform scale-x-0 transition-transform group-hover:scale-x-100" />
        </div>
        
        <nav className="flex gap-6 items-center">
          <Link to="/" className="group flex items-center hover:text-blue-600 transition-colors duration-200">
            <Home size={20} className="group-hover:text-blue-500 transition-colors duration-200" />
            <span className="ml-2 relative">
              Home
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </span>
          </Link>
          
          <Link to="/blogs/create" className="group flex items-center hover:text-blue-600 transition-colors duration-200">
            <PenTool size={20} className="group-hover:text-blue-500 transition-colors duration-200" />
            <span className="ml-2 relative">
              Create
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </span>
          </Link>
          
          <Link to="likes" className="group flex items-center hover:text-blue-600 transition-colors duration-200">
            <Heart size={20} className="group-hover:text-blue-500 transition-colors duration-200" />
            <span className="ml-2 relative">
              Likes
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </span>
          </Link>
        </nav>
      </div>
    </header>
      <Routes>
        <Route 
          path="/" 
          element={
            <BlogList 
              blogs={blogs}
              onLike={handleToggleLike}
              onDelete={handleDeleteBlog}
              onPin={handleTogglePin}
              onUpdateBlog={handleUpdateBlog}
            />
          } 
        />
        <Route 
          path="/create" 
          element={<CreateBlog onCreateBlog={handleCreateBlog} />} 
        />
        <Route 
          path="/blog/:id" 
          element={
            <BlogView 
              blogs={blogs}
              onLike={handleToggleLike}
              onDelete={handleDeleteBlog}
              onPin={handleTogglePin}
              onUpdateBlog={handleUpdateBlog}
            />
          } 
        />
        <Route 
          path="/edit/:id" 
          element={
            <EditBlog 
              blogs={blogs}
              onUpdateBlog={handleUpdateBlog}
            />
          } 
        />
        <Route 
    path="likes"
    element={<LikedBlogs blogs={blogs} onLike={handleToggleLike} onDelete={handleDeleteBlog} onPin={handleTogglePin} />} 
  />
      </Routes>
    </div>
  );
};

export default BlogsPage;
