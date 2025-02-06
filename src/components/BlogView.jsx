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
  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/blogs/edit/${blog.id}`);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto ">
      <div className="relative bg-white p-8 rounded-lg shadow-md overflow-hidden">
  {/* Top Border */}
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-t-lg"></div>
  {/* Bottom Border */}
  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded-b-lg"></div>
  {/* Left Border */}
  <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-500 rounded-l-lg"></div>
  {/* Right Border */}
  <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-blue-400 via-indigo-500 to-purple-500 rounded-r-lg"></div>

  {/* Content */}
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
              className={`p-2 rounded-md text-gray-600 transition-colors duration-200 hover:text-[#9575CD]${
                blog.isPinned ? 'text-[#9575CD]' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                onPin(blog.id);}}
            >
              <Pin size={20} />
            </button>
            <button
              className="p-2 rounded-md text-blue-500 hover:text-blue-600"
              onClick={handleEditClick}
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
