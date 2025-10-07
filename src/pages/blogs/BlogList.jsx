import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";
import { PenTool, Heart, BookOpen, Search } from "lucide-react";
import BlogCard from "./BlogCard";

const SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  ALPHABETICAL: "alphabetical",
  REVERSE_ALPHABETICAL: "reverseAlphabetical",
};

const BlogList = ({
  blogs,
  onLike,
  onDelete = () => {},
  onPin = () => {},
  showHeader = true,
}) => {
  const safelyProcessId = (id) => {
    const numId = Number(id);
    return !isNaN(numId) ? numId : String(id);
  };

  const processedBlogs = useMemo(() => {
    return blogs.map((blog) => ({
      ...blog,
      id: safelyProcessId(blog.id),
    }));
  }, [blogs]);

  const [filteredBlogs, setFilteredBlogs] = useState(processedBlogs);
  const [sortOption, setSortOption] = useState(
    () => localStorage.getItem("blogSortPreference") || SORT_OPTIONS.NEWEST
  );
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const sortMenuRef = useRef(null);

  const filterAndSortBlogs = useCallback(
    (blogsToFilter, searchTerm = "") => {
      let filtered = [...blogsToFilter];

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (blog) =>
            blog.title.toLowerCase().includes(searchLower) ||
            blog.content.toLowerCase().includes(searchLower)
        );
      }

      filtered = filtered.map((blog) => ({
        ...blog,
        id: safelyProcessId(blog.id),
      }));

      const pinnedBlogs = filtered.filter((blog) => blog.isPinned);
      const unpinnedBlogs = filtered.filter((blog) => !blog.isPinned);

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

      const sortedPinned = getSortedBlogs(pinnedBlogs);
      const sortedUnpinned = getSortedBlogs(unpinnedBlogs);

      return [...sortedPinned, ...sortedUnpinned];
    },
    [sortOption]
  );

  useEffect(() => {
    const filtered = filterAndSortBlogs(processedBlogs, searchTerm);
    setFilteredBlogs(filtered);
  }, [processedBlogs, filterAndSortBlogs, searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setShowSortMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSortSelect = (option) => {
    setSortOption(option);
    localStorage.setItem("blogSortPreference", option);
    setShowSortMenu(false);
  };

  return (
    <div className="min-h-screen bg-#03030A">
      <div className="container mx-auto px-4 py-8">
        {showHeader && (
          <div className="mb-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                      Blogs
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Capture your thoughts, share your ideas, and inspire
                      others.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search, Sort, and Navigation Controls - Aligned in a single row */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex-grow max-w-lg relative">
              <input
                type="text"
                className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-gray-200 
      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
      transition-all duration-200 placeholder:text-gray-400"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Button */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-full 
                    shadow-sm border border-purple-100 text-purple-600 hover:bg-purple-50 
                    transition-all duration-200"
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
                          ${
                            sortOption === value
                              ? "bg-indigo-50 text-indigo-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        onClick={() => handleSortSelect(value)}
                      >
                        {key === "NEWEST"
                          ? "Newest First"
                          : key === "OLDEST"
                          ? "Oldest First"
                          : key === "ALPHABETICAL"
                          ? "A-Z"
                          : "Z-A"}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <Link
                to="/blogs/create"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-purple-500 
                  rounded-full shadow-sm text-white font-medium hover:shadow-md transition-all duration-200"
              >
                <PenTool size={16} />
                <span>Create</span>
              </Link>

              <Link
                to="/likes"
                className="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm rounded-full 
                  shadow-sm border border-purple-100 text-purple-600 hover:bg-purple-50 
                  transition-all duration-200"
              >
                <Heart size={16} />
                <span>Likes</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Cards Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => {
                // Generate a reliable key - use combination of id and title if needed
                const blogKey =
                  typeof blog.id === "number" && !isNaN(blog.id)
                    ? blog.id.toString()
                    : `blog-${blog.title}-${Date.now()}`;

                return (
                  <BlogCard
                    key={blogKey}
                    blog={{
                      ...blog,
                      id: safelyProcessId(blog.id), // Ensure ID is safely converted
                    }}
                    onLike={onLike}
                    onDelete={onDelete}
                    onPin={onPin}
                  />
                );
              })
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Allow both string and number
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      isLiked: PropTypes.bool.isRequired,
      isPinned: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onPin: PropTypes.func,
  showHeader: PropTypes.bool,
};

export default BlogList;
