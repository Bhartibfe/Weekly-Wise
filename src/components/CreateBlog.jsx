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
      navigate('/');
    } catch (error) {
      console.error('Failed to create the blog:', error);
      alert('There was an error creating the blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-gray-900">Create New Blog</h2>
        <div>
          <input
            type="text"
            placeholder="Blog Title"
            value={blogData.title}
            onChange={(e) => setBlogData(prev => ({ ...prev, title: e.target.value }))}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <textarea
            placeholder="Blog Content"
            value={blogData.content}
            onChange={(e) => setBlogData(prev => ({ ...prev, content: e.target.value }))}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[400px]"
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-purple-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Blog'}
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
