//import React from 'react';
import PropTypes from 'prop-types';
import BlogList from './BlogList';

const LikedBlogs = ({ blogs, onLike }) => {
  return (
    <div className="liked-blogs-container">
      <h2 className="liked-blogs-title">Liked Blogs</h2>
      <BlogList blogs={blogs} onLike={onLike} />
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
        isLiked: PropTypes.bool.isRequired
      })
    ).isRequired,
    onLike: PropTypes.func.isRequired
  };
export default LikedBlogs;
