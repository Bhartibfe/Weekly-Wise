import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Edit, Trash2, Pin } from 'lucide-react';
import PropTypes from 'prop-types';

const BlogView = ({ blogs, onLike, onDelete, onPin }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = blogs.find(blog => blog.id === parseInt(id));

  if (!blog) return <div>Blog not found</div>;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      onDelete(blog.id);
      navigate('/');
    }
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="bg-white border-2 border-[#c49fe7] p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-[#272829] text-2xl font-semibold">{blog.title}</h1>
          <div className="flex gap-2">
            <button
              className={`p-2 rounded-md text-gray-600 transition-colors duration-200 hover:text-[#e91e63] ${
                blog.isLiked ? 'text-[#e91e63]' : ''
              }`}
              onClick={() => onLike(blog.id)}
            >
              <Heart size={20} />
            </button>
            <button
              className={`p-2 rounded-md text-gray-600 transition-colors duration-200 hover:text-[#9575CD] ${
                blog.isPinned ? 'text-[#9575CD]' : ''
              }`}
              onClick={() => onPin(blog.id)}
            >
              <Pin size={20} />
            </button>
            <button
              className="p-2 rounded-md text-blue-500 hover:text-blue-600"
              onClick={() => navigate(`/edit/${blog.id}`)}
            >
              <Edit size={20} />
            </button>
            <button
              className="p-2 rounded-md text-red-500 hover:text-red-600"
              onClick={handleDelete}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
        <span className="block text-gray-500 text-sm mb-6">{blog.date}</span>
        <div className="text-[#272829] text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
    </div>
  );
};

BlogView.propTypes = {
  blogs: PropTypes.array.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired,
};

export default BlogView;
