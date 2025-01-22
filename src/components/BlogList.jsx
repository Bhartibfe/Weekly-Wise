import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import SearchBar from './SearchBar';
import { ArrowUpDown } from 'lucide-react';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/LocalStorage';

const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  ALPHABETICAL: 'alphabetical',
  REVERSE_ALPHABETICAL: 'reverseAlphabetical'
};

const BlogList = ({ blogs, onLike, onDelete = () => {}, onPin = () => {} }) => {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [sortOption, setSortOption] = useState(() => 
    loadFromLocalStorage('blogSortPreference') || SORT_OPTIONS.NEWEST
  );
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const sortMenuRef = useRef(null);

  const filterAndSortBlogs = useCallback((blogsToFilter, searchTerm = '') => {
    let filtered = [...blogsToFilter];
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower)
      );
    }
    
    switch (sortOption) {
      case SORT_OPTIONS.ALPHABETICAL:
        return filtered.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return a.title.localeCompare(b.title);
        });
      case SORT_OPTIONS.REVERSE_ALPHABETICAL:
        return filtered.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return b.title.localeCompare(a.title);
        });
      case SORT_OPTIONS.OLDEST:
        return filtered.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return new Date(a.date) - new Date(b.date);
        });
      case SORT_OPTIONS.NEWEST:
      default:
        return filtered.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
          return new Date(b.date) - new Date(a.date);
        });
    }
  }, [sortOption]);

  useEffect(() => {
    const filtered = filterAndSortBlogs(blogs, searchTerm);
    setFilteredBlogs(filtered);
  }, [blogs, filterAndSortBlogs, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    saveToLocalStorage('blogSortPreference', option);
    setShowSortMenu(false);
  };

  return (
    <div className="px-12 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <SearchBar onSearch={handleSearch} />
        <div className="relative">
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="p-2 rounded-md text-gray-600 hover:text-[#5A67D8] focus:outline-none"
          >
            <ArrowUpDown size={20} />
          </button>
          {showSortMenu && (
            <div 
              className="absolute right-0 top-full mt-2 bg-white border rounded-md shadow-lg min-w-[150px] z-10"
              ref={sortMenuRef}
            >
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOption === SORT_OPTIONS.NEWEST ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSortSelect(SORT_OPTIONS.NEWEST)}
              >
                Newest First
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOption === SORT_OPTIONS.OLDEST ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSortSelect(SORT_OPTIONS.OLDEST)}
              >
                Oldest First
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOption === SORT_OPTIONS.ALPHABETICAL ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSortSelect(SORT_OPTIONS.ALPHABETICAL)}
              >
                A-Z
              </button>
              <button
                className={`block w-full text-left px-4 py-2 text-sm ${
                  sortOption === SORT_OPTIONS.REVERSE_ALPHABETICAL ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleSortSelect(SORT_OPTIONS.REVERSE_ALPHABETICAL)}
              >
                Z-Ab
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBlogs.map(blog => (
          <BlogCard 
            key={blog.id} 
            blog={blog} 
            onLike={onLike} 
            onDelete={onDelete}
            onPin={onPin}
          />
        ))}
      </div>
    </div>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      isLiked: PropTypes.bool.isRequired,
      isPinned: PropTypes.bool.isRequired
    })
  ).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onPin: PropTypes.func
};

export default BlogList;
