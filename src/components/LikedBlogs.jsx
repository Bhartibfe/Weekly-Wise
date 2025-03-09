import BlogList from './BlogList';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LikedBlogs = ({ blogs, onLike, onDelete, onPin }) => {
  // Filter only liked blogs
  const likedBlogs = blogs.filter(blog => blog.isLiked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            ❤️ Your Liked Posts ❤️
          </h1>
          <p className="text-lg text-purple-700 mb-6">
            Collection of your favorite masterpieces
          </p>
          
          {likedBlogs.length === 0 && (
            <div className="mt-6 text-center p-8 bg-white/70 rounded-lg">
              <p className="text-purple-600 text-lg mb-4">You haven&apos;t liked any blogs yet</p>
              <Link 
                to="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Discover Blogs
              </Link>
            </div>
          )}
        </div>

        {likedBlogs.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <BlogList 
              blogs={likedBlogs}
              onLike={onLike}
              onDelete={onDelete}
              onPin={onPin}
              showHeader={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

LikedBlogs.propTypes = {
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
  onPin: PropTypes.func.isRequired
};

export default LikedBlogs;