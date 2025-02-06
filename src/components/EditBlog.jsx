import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import QuillEditor from './QuillEditor';

const EditBlog = ({ blogs, onUpdateBlog }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentBlog = blogs.find(b => b.id === parseInt(id));
    if (currentBlog) {
      setBlogData({
        ...currentBlog,
        content: currentBlog.content || ''
      });
    }
  }, [blogs, id]);

  const handleContentChange = useCallback((content) => {
    setBlogData(prev => ({
      ...prev,
      content
    }));
  }, []);

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
      await onUpdateBlog({
        ...blogData,
        id: parseInt(id),
        date: new Date().toISOString()
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to update blog:', error);
      alert('There was an error updating the blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!blogData) return <div className="p-8 text-center">Blog not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-gray-900">Edit Blog</h2>
        <div>
          <input
            type="text"
            placeholder="Blog Title"
            value={blogData.title}
            onChange={(e) => setBlogData(prev => ({ ...prev, title: e.target.value }))}
            disabled={isSubmitting}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="min-h-[400px]">
          <QuillEditor
            value={blogData.content}
            onChange={handleContentChange}
            disabled={isSubmitting}
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
            {isSubmitting ? 'Updating...' : 'Update Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

EditBlog.propTypes = {
  blogs: PropTypes.array.isRequired,
  onUpdateBlog: PropTypes.func.isRequired
};

export default EditBlog;