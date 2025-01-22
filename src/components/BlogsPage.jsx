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
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === parseInt(id) ? { ...blog, isLiked: !blog.isLiked } : blog
      )
    );
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-purple-700 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl">Blogs</h1>
        <div className="flex gap-4 items-center">
          <nav className="flex gap-4">
            <Link to="/" className="flex items-center text-white hover:opacity-80">
              <Home size={20} />
              <span className="ml-2">Home</span>
            </Link>
            <Link to="create" className="flex items-center text-white hover:opacity-80">
              <PenTool size={20} />
              <span className="ml-2">Create</span>
            </Link>
            <Link to="likes" className="flex items-center text-white hover:opacity-80">
              <Heart size={20} />
              <span className="ml-2">Likes</span>
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
    path="/likes" 
    element={
      <LikedBlogs 
        blogs={blogs.filter(blog => blog.isLiked)}
        onLike={handleToggleLike}
      />
    } 
  />
</Routes>
    </div>
  );
};

export default BlogsPage;
