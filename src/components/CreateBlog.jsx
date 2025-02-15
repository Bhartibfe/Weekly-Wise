import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const CreateBlog = ({ onCreateBlog }) => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blogData.title.trim()) {
      alert('Blog title cannot be empty!');
      return;
    }

    if (!blogData.content?.trim()) {
      alert('Blog content cannot be empty!');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateBlog({
        ...blogData,
        date: new Date().toISOString()
      });
      navigate('/blogs');
    } catch (error) {
      console.error('Failed to create the blog:', error);
      alert('There was an error creating the blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-pink-50 to-purple-100 rounded-lg shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          ✨ Create Your Masterpiece ✨
        </h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Give your blog a catchy title..."
            value={blogData.title}
            onChange={(e) => setBlogData(prev => ({ ...prev, title: e.target.value }))}
            required
            disabled={isSubmitting}
            className="w-full px-6 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-purple-800 font-medium placeholder:text-purple-300"
          />
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <span className="text-purple-400">📝</span>
          </div>
        </div>
        
        <div className="relative mt-6">
          <textarea
            placeholder="Share your thoughts with the world..."
            value={blogData.content}
            onChange={(e) => setBlogData(prev => ({ ...prev, content: e.target.value }))}
            required
            
            disabled={isSubmitting}
            className="w-full px-6 py-4 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm text-purple-800 min-h-[400px] resize-none placeholder:text-purple-300"
          />
          <div className="absolute top-4 left-2 pointer-events-none">
            <span className="text-purple-400">✍️</span>
          </div>
        </div>
        
        <div className="flex gap-6 pt-4">
          <button
            type="button"
            onClick={() => navigate('/blogs')}
            className="flex-1 px-6 py-3 border-2 border-purple-400 text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <span>Cancel</span>
            <span>🔙</span>
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-70 font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <span>Publish Blog</span>
                <span>🚀</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

CreateBlog.propTypes = {
  onCreateBlog: PropTypes.func.isRequired,
};

export default CreateBlog;