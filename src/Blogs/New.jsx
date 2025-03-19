import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const New = ({ onAddBlog }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleAddBlog = () => {
    if (title.trim() && content.trim()) {
      onAddBlog({ title, content });
      setTitle('');
      setContent('');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Blog</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Content</label>
            <textarea
              placeholder="Write your blog content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            ></textarea>
          </div>
          <button 
            onClick={handleAddBlog}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Publish Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default New;
