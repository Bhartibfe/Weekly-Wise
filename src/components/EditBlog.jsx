import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import QuillEditor from './QuillEditor';

const EditBlog = ({ blogs, onUpdateBlog }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const currentBlog = blogs.find(b => b.id === parseInt(id));
    if (currentBlog) {
      setBlog(currentBlog);
    }
  }, [blogs, id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!blog?.content?.trim()) {
      alert('Blog content cannot be empty!');
      return;
    }
    onUpdateBlog(blog);
    navigate('/blogs'); // Update this line to navigate to the root
  };

  if (!blog) return <div className="p-8 text-center">Blog not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-gray-900">Edit Blog</h2>
        <div>
          <input
            type="text"
            placeholder="Blog Title"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="min-h-[400px]">
          <QuillEditor
            value={blog.content}
            onChange={(content) => setBlog({ ...blog, content })}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

EditBlog.propTypes = {
  blogs: PropTypes.array.isRequired,
  onUpdateBlog: PropTypes.func.isRequired
};

export default EditBlog;