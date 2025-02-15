import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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
    setBlogs(prevBlogs => {
      const updatedBlogs = prevBlogs.map(blog => {
        if (blog.id === Number(id)) {
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
      id: Number(Date.now()),
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
    setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== Number(id)));
  };

  const handleTogglePin = (id) => {
    setBlogs(prevBlogs =>
      prevBlogs.map(blog =>
        blog.id === Number(id) ? { ...blog, isPinned: !blog.isPinned } : blog
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 min-h-[calc(100vh-12rem)]">
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
              element={
                <LikedBlogs 
                  blogs={blogs} 
                  onLike={handleToggleLike} 
                  onDelete={handleDeleteBlog} 
                  onPin={handleTogglePin} 
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;