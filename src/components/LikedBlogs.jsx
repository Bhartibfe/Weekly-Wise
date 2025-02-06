import BlogList from './BlogList';
import PropTypes from 'prop-types';

const LikedBlogs = ({ blogs, onLike, onDelete, onPin }) => {
  // Filter only liked blogs
  const likedBlogs = blogs.filter(blog => blog.isLiked);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Liked Posts
          </h1>
          <p className="text-lg text-gray-600">
            Collection of your favorite blogs
          </p>
        </div>

        <BlogList 
          blogs={likedBlogs}
          onLike={onLike}
          onDelete={onDelete}
          onPin={onPin}
        />
      </div>
    </div>
  );
};

LikedBlogs.propTypes = {
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
  onDelete: PropTypes.func.isRequired,
  onPin: PropTypes.func.isRequired
};

export default LikedBlogs;