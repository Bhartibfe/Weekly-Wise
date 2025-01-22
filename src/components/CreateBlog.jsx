import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import QuillEditor from './QuillEditor';
//import '../styles/CreateBlog.css';

const CreateBlog = ({ onCreateBlog }) => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!blog.title.trim()) {
      alert('Blog title cannot be empty!');
      return;
    }
    if (!blog.content.trim()) {
      alert('Blog content cannot be empty!');
      return;
    }

    setIsSubmitting(true);
    try {
      onCreateBlog({
        ...blog,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to create the blog:', error);
      alert('There was an error creating the blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-blog-container">
      <form className="create-blog-form" onSubmit={handleSubmit}>
        <h2>Create New Blog</h2>
        <input
          type="text"
          placeholder="Blog Title"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          required
          className="blog-title-input"
          disabled={isSubmitting}
        />
        <QuillEditor
          value={blog.content}
          onChange={(content) => setBlog({ ...blog, content })}
        />
        <button 
          type="submit" 
          className="publish-button" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Publishing...' : 'Publish Blog'}
        </button>
      </form>
    </div>
  );
};

CreateBlog.propTypes = {
  onCreateBlog: PropTypes.func.isRequired,
};

export default CreateBlog;
