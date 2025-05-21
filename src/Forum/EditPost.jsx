import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextEditor from "../Components/TextEditor/TextEditor.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    content: '',
    contentType: 'html',
    username: '',
    image: null,
    thumbnail: null,
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Check if user is admin
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isAdmin = userData.isAdmin || false;

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied: Admin privileges required');
      navigate('/forum');
      return;
    }

    // Fetch post data
    const fetchPost = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        const data = await response.json();
        console.log(`Fetched post: ID=${id}, ContentType=${data.contentType}, Image=${data.image}, Thumbnail=${data.thumbnail}`);
        setPost({
          title: data.title,
          content: data.content,
          contentType: data.contentType,
          username: data.username,
          image: data.image ? `${import.meta.env.VITE_BACKEND_URL}${data.image}` : null,
          thumbnail: data.thumbnail ? `${import.meta.env.VITE_BACKEND_URL}${data.thumbnail}` : null,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        navigate('/forum');
      }
    };

    fetchPost();
  }, [id, navigate, isAdmin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      console.log(`New file selected: Name=${file.name}, Type=${file.type}, Size=${file.size}`);
      // Set contentType based on file type
      const newContentType = file.type.startsWith('video/') ? 'video' : 'image';
      setPost(prev => ({ ...prev, contentType: newContentType }));
    }
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Error playing video preview:', err);
          toast.error('Failed to play video preview', { position: 'top-center' });
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.title || !post.username) {
      toast.error('Title and username are required');
      return;
    }
    if (post.contentType === 'html' && !post.content) {
      toast.error('Content is required for text posts');
      return;
    }
    if (newImage && !['image', 'video'].includes(post.contentType)) {
      toast.error('Invalid content type for file upload');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('contentType', post.contentType);
    formData.append('username', post.username);
    if (newImage) {
      formData.append('image', newImage);
    }

    console.log('Submitting form:', {
      title: post.title,
      contentType: post.contentType,
      username: post.username,
      hasNewImage: !!newImage,
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/forum/edit/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      toast.success('Post updated successfully');
      navigate(`/forum/${id}`);
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={post.username}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">Content Type</label>
          <select
            id="contentType"
            name="contentType"
            value={post.contentType}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="html">Text</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {post.contentType === 'html' && (
          <div className="mb-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
            <TextEditor
              id="content"
              value={post.content}
              onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Add Body"
            />
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image/Video</label>
          {post.image && (
            <div className="mb-2 relative">
              <p className="text-sm text-gray-500">Current media:</p>
              {post.contentType === 'video' ? (
                <>
                  <video
                    ref={videoRef}
                    src={post.image}
                    alt={post.title || "Video post"}
                    title={post.title || "Video post"}
                    className="max-w-xs max-h-[300px] object-contain rounded-lg shadow-md"
                    controls
                    muted
                    playsInline
                    poster={post.thumbnail || undefined}
                    onError={(e) => {
                      console.error(`Video preview failed to load: ${post.image}`, e);
                      toast.error('Failed to load video preview', { position: 'top-center' });
                    }}
                  >
                    <source src={post.image} type="video/mp4" />
                    <source src={post.image} type="video/webm" />
                    <source src={post.image} type="video/quicktime" />
                    Your browser does not support the video tag.
                  </video>
                  {!isPlaying && (
                    <button
                      onClick={handlePlay}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
                      aria-label="Play video preview"
                    >
                      <svg
                        className="w-12 h-12 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <img
                  src={post.image}
                  alt={post.title || "Current post"}
                  className="max-w-xs max-h-[300px] object-contain rounded-lg shadow-md"
                  onError={() => toast.error('Failed to load image preview', { position: 'top-center' })}
                />
              )}
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*,video/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/forum/${id}`)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
