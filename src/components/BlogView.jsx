import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Edit, Trash2, Pin, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

const BlogView = ({ blogs, onLike, onDelete, onPin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // First try to find by exact match, then try with number conversion
  const blog = blogs.find(blog => blog.id === id) || 
               blogs.find(blog => blog.id === Number(id));

  if (!blog) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
        <div className="text-4xl mb-4">✨</div>
        <div className="text-xl text-gray-600">Blog not found</div>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      onDelete(blog.id);
      navigate('/');
    }
  };

  const formatDate = (dateString) => {
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full -translate-y-32 translate-x-32 blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100/40 to-purple-100/40 rounded-full translate-y-32 -translate-x-32 blur-3xl pointer-events-none"/>
        
        {/* Content container */}
        <div className="relative p-8">
          {/* Header section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center gap-3 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">{formatDate(blog.date)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="absolute top-8 right-8 flex gap-3">
            <button
              className={`p-3 rounded-full transition-all duration-300 ${
                blog.isLiked 
                  ? 'bg-pink-50 text-pink-500 hover:bg-pink-100' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
              onClick={() => onLike(blog.id)}
            >
              <Heart size={20} className={blog.isLiked ? 'fill-current' : ''} />
            </button>
            <button
              className={`p-3 rounded-full transition-all duration-300 ${
                blog.isPinned 
                  ? 'bg-purple-50 text-purple-500 hover:bg-purple-100' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
              }`}
              onClick={() => onPin(blog.id)}
            >
              <Pin size={20} />
            </button>
            <button
              className="p-3 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all duration-300"
              onClick={() => navigate(`/blogs/edit/${blog.id}`)}
            >
              <Edit size={20} />
            </button>
            <button
              className="p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-all duration-300"
              onClick={handleDelete}
            >
              <Trash2 size={20} />
            </button>
          </div>

          {/* Blog content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

BlogView.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      isLiked: PropTypes.bool.isRequired,
      isPinned: PropTypes.bool.isRequired
    })
  ).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired,
};

export default BlogView;