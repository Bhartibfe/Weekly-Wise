import { useNavigate } from 'react-router-dom';
import { Heart, Edit, Trash2, MoreVertical, Pin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const BlogCard = ({ blog, onLike, onDelete, onPin }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this blog?')) {
      onDelete(blog.id);
    }
    setShowDropdown(false);
  };

  const previewContent = (content) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    const text = div.textContent || div.innerText;
    const words = text.split(' ').slice(0, 20).join(' ');
    return words + (text.split(' ').length > 20 ? '...' : '');
  };

  const formatDate = (dateString) => {
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const capitalizeFirstWord = (title) => {
    const words = title.split(' ');
    if (words.length > 0) {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    }
    return words.join(' ');
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/blogs/edit/${blog.id}`);
    setShowDropdown(false);
  };

  return (
    <div
      className={`relative bg-white rounded-lg p-6 shadow-md overflow-hidden transition-transform duration-200 hover:translate-y-[-2px] flex flex-col min-h-[200px] ${
        blog.isPinned ? 'border-2 border-[#c49fe7] bg-[#f8f9fa]' : ''
      }`}
    >
      {/* Dropdown Menu */}
      <div className="absolute top-7 right-2 flex gap-2 items-center z-10">
        <button
          className="bg-none border-none cursor-pointer p-2 text-gray-500 hover:text-[#2196F3]"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <MoreVertical size={20} />
        </button>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-full bg-white border border-gray-300 rounded-lg shadow-lg z-50"
          >
            <button 
              className="flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-100"
              onClick={handleEditClick}
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              className="flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-100"
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              className="flex items-center gap-2 p-2 text-gray-500 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                onPin(blog.id);
                setShowDropdown(false);
              }}
            >
              <Pin size={16} />
              <span>{blog.isPinned ? 'Unpin' : 'Pin'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex-grow">
        {/* Blog Title */}
        <h2 className="text-[#272829] text-xl mb-4">{capitalizeFirstWord(blog.title)}</h2>

        {/* Blog Content Preview */}
        <p className="text-gray-500 text-base line-clamp-3">{previewContent(blog.content)}</p>
      </div>

      {/* Bottom Section Container */}
      <div className="mt-auto pt-4">
        {/* Date */}
        <span className="block text-gray-500 text-sm mb-2">{formatDate(blog.date)}</span>

        {/* Read More and Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            className="text-[#9575CD] text-sm font-medium hover:text-[#9575CD]"
            onClick={() => navigate(`/blogs/blog/${blog.id}`)}
          >
            Read More →
          </button>

          <div className="flex items-center gap-2">
            {blog.isPinned && (
              <button
                className="bg-none border-none cursor-pointer p-2 text-[#CC9CDA] transition-colors duration-300 ease-in-out hover:text-[#A97ECB]"
                onClick={(e) => {
                  e.preventDefault();
                  onPin(blog.id);
                }}
              >
                <Pin size={20} />
              </button>
            )}
            
            <button
  className={`bg-none border-none cursor-pointer p-2 text-gray-500 transition-colors duration-200 hover:text-[#FF4081] ${
    blog.isLiked ? 'text-[#e91e63]' : ''
  }`}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(parseInt(blog.id)); // Ensure id is parsed as integer
  }}
>
  <Heart size={20} />
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogCard.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    isLiked: PropTypes.bool.isRequired,
    isPinned: PropTypes.bool.isRequired,
  }).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired,
};

export default BlogCard;