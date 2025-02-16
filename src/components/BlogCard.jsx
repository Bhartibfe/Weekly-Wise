import { useNavigate } from 'react-router-dom';
import { Heart, Edit, Trash2, MoreVertical, Pin, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const BlogCard = ({ blog, onLike, onDelete, onPin }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    // Only add the event listener when the dropdown is shown
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]); // Add showDropdown to dependency array

  const handleCardClick = () => {
    navigate(`/blogs/blog/${blog.id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    e.stopPropagation();
    navigate(`/blogs/edit/${blog.id}`);
    setShowDropdown(false);
  };


  return (
    <div
      onClick={handleCardClick}
      className={`group relative p-6 rounded-2xl shadow-lg overflow-visible transition-all duration-300 
        ${isHovered ? 'shadow-xl transform -translate-y-1' : ''} 
        ${blog.isPinned ? 'bg-purple-50/70 border-2 border-purple-200' : 'bg-white/90 backdrop-blur-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        // Don't close dropdown on mouse leave
      }}
    >
      {/* Decorative blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-100/20 via-pink-100/20 to-blue-100/20 rounded-full blur-2xl transform rotate-45 transition-transform duration-500 group-hover:rotate-90"/>
      
      {/* Content */}
      <div className="relative z-20"> {/* Increased z-index */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {capitalizeFirstWord(blog.title)}
          </h2>
          
          {/* More button and dropdown */}
          <div className="relative">
            <button
              ref={buttonRef}
              className="p-2 text-gray-400 hover:text-purple-500 transition-colors duration-200"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <MoreVertical size={18} />
            </button>
            
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 w-28"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-purple-50 w-full transition-colors"
                  onClick={handleEditClick}
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-red-50 w-full transition-colors"
                  onClick={handleDelete}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
                <button
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-purple-50 w-full transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onPin(blog.id);
                    setShowDropdown(false);
                  }}
                >
                  <Pin size={14} />
                  {blog.isPinned ? 'Unpin' : 'Pin'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
        
      {/* Content Container */}
      <div className="flex-grow relative z-0">

        {/* Blog Content Preview */}
        <p className="text-gray-600 text-base line-clamp-3">{previewContent(blog.content)}</p>
      </div>

      {/* Bottom Section Container */}
      <div className="mt-auto pt-4 relative z-0">
        {/* Date */}
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Clock size={16} />
          <span className="text-sm">{formatDate(blog.date)}</span>
        </div>

        {/* Read More and Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            className="px-4 py-2 text-[#9575CD] font-medium rounded-full 
              bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 
              transition-all duration-300"
            onClick={() => navigate(`/blogs/blog/${blog.id}`)}
          >
            Read More →
          </button>

          <div className="flex items-center gap-2">
          {blog.isPinned && (
  <button
    className="bg-purple-200 rounded-full p-2 text-purple-700 duration-300 hover:bg-purple-300"
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onPin(blog.id);
    }}
  >
    <Pin size={20} className="fill-purple-100" />
  </button>
)}
            <button
              className={`rounded-full p-2 transition-all duration-300 
                ${blog.isLiked 
                  ? 'bg-pink-50 text-pink-500 hover:bg-pink-100' 
                  : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLike(parseInt(blog.id));
              }}
            >
              <Heart size={20} className={blog.isLiked ? 'fill-current' : ''} />
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