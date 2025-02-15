import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import BlogCard from './BlogCard';
import { ArrowUpDown } from 'lucide-react';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import { Home, PenTool, Heart } from 'lucide-react';

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
    
    // Separate pinned and unpinned blogs
    const pinnedBlogs = filtered.filter(blog => blog.isPinned);
    const unpinnedBlogs = filtered.filter(blog => !blog.isPinned);
    
    // Sort function for both pinned and unpinned groups
    const getSortedBlogs = (blogs) => {
      switch (sortOption) {
        case SORT_OPTIONS.ALPHABETICAL:
          return blogs.sort((a, b) => a.title.localeCompare(b.title));
        case SORT_OPTIONS.REVERSE_ALPHABETICAL:
          return blogs.sort((a, b) => b.title.localeCompare(a.title));
        case SORT_OPTIONS.OLDEST:
          return blogs.sort((a, b) => new Date(a.date) - new Date(b.date));
        case SORT_OPTIONS.NEWEST:
        default:
          return blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
    };

    // Sort each group separately
    const sortedPinned = getSortedBlogs(pinnedBlogs);
    const sortedUnpinned = getSortedBlogs(unpinnedBlogs);

    // Combine the sorted groups with pinned blogs first
    return [...sortedPinned, ...sortedUnpinned];
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100/50 via-pink-50/50 to-blue-100/50">
      <div className="container mx-auto px-4 py-8">
        {showHeader && (
          <div className="relative mb-12">
            {/* Navigation moved to top right */}
            <div className="absolute top-0 right-0">
              <nav className="flex gap-4 items-center">
                <Link to="/" className="group flex items-center transition-all duration-300 hover:scale-105">
                  <div className="relative p-2 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 group-hover:from-purple-200 group-hover:to-pink-200">
                    <Home size={20} className="text-purple-600 group-hover:text-purple-700" />
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Home
                    </span>
                  </div>
                </Link>

                <Link to="/blogs/create" className="group flex items-center transition-all duration-300 hover:scale-105">
                  <div className="relative p-2 rounded-lg bg-gradient-to-r from-pink-100 to-purple-100 group-hover:from-pink-200 group-hover:to-purple-200">
                    <PenTool size={20} className="text-pink-600 group-hover:text-pink-700" />
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Create
                    </span>
                  </div>
                </Link>

                <Link to="likes" className="group flex items-center transition-all duration-300 hover:scale-105">
                  <div className="relative p-2 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200">
                    <Heart size={20} className="text-blue-600 group-hover:text-blue-700" />
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Likes
                    </span>
                  </div>
                </Link>
              </nav>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Explore Our Blog
              </h1>
              <p className="text-lg text-gray-600">
                Discover interesting stories and insights
              </p>
            </div>
          </div>
        )}

        {/* Search and Sort Controls */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="w-full md:w-96">
              <SearchBar 
                onSearch={handleSearch}
                className="w-full"
              />
            </div>
            
            <div className="relative">
              <button 
              
                className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-full 
                  shadow-sm border border-purple-100 text-purple-600 hover:bg-purple-50 
                  transition-all duration-200 "
                  onClick={() => setShowSortMenu(!showSortMenu)}
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

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="col-span-full flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <p className="text-xl text-gray-600">
                    No blogs found matching your search.
                  </p>
                </div>
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