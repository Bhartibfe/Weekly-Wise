import { useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ]
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link'
  ];

  return (
    <div className="bg-white rounded-lg">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="h-64"
      />
    </div>
  );
};

// PropTypes definition for QuillEditor component
QuillEditor.propTypes = {
  value: PropTypes.string.isRequired, // value prop is a required string
  onChange: PropTypes.func.isRequired, // onChange prop is a required function
  placeholder: PropTypes.string // placeholder prop is an optional string
};

export default QuillEditor;
