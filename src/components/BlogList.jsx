import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import { ArrowUpDown } from 'lucide-react';
import SearchBar from './SearchBar';

const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  ALPHABETICAL: 'alphabetical',
  REVERSE_ALPHABETICAL: 'reverseAlphabetical'
};

const BlogList = ({ blogs, onLike, onDelete = () => {}, onPin = () => {}, showHeader = true }) => {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [sortOption, setSortOption] = useState(() => 
    localStorage.getItem('blogSortPreference') || SORT_OPTIONS.NEWEST
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
    localStorage.setItem('blogSortPreference', option);
    setShowSortMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {showHeader && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Our Blog
            </h1>
            <p className="text-lg text-gray-600">
              Discover interesting stories and insights
            </p>
          </div>
        )}

        {/* Centered Search and Sort Controls */}
        <div className="max-w-3xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="w-96">
              <SearchBar 
                onSearch={handleSearch}
                className="text-lg shadow-sm"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 px-4 py-3 bg-white rounded-full shadow-sm border 
                  border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200 whitespace-nowrap"
              >
                <ArrowUpDown size={16} />
                <span>Sort</span>
              </button>
              {showSortMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 bg-white border border-gray-100 
                    rounded-lg shadow-lg min-w-[180px] z-10 overflow-hidden"
                  ref={sortMenuRef}
                >
                  {Object.entries(SORT_OPTIONS).map(([key, value]) => (
                    <button
                      key={value}
                      className={`block w-full text-left px-4 py-3 text-sm transition-colors duration-150
                        ${sortOption === value 
                          ? 'bg-indigo-50 text-indigo-600 font-medium' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      onClick={() => handleSortSelect(value)}
                    >
                      {key === 'NEWEST' ? 'Newest First' : 
                       key === 'OLDEST' ? 'Oldest First' : 
                       key === 'ALPHABETICAL' ? 'A-Z' : 'Z-A'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <BlogCard 
                  key={blog.id}
                  blog={blog} 
                  onLike={onLike} 
                  onDelete={onDelete}
                  onPin={onPin}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-lg text-gray-600">
                  No blogs found matching your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
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
  onPin: PropTypes.func,
  showHeader: PropTypes.bool
};

export default BlogList;