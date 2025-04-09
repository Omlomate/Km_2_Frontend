import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Add Link import
import ForumPosts from "./ForumPost.jsx";
import TextEditor from "../Components/TextEditor/TextEditor.jsx";

const ShowForum = ({ posts, onAddComment, onLikeComment, onDislikeComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [showOptions, setShowOptions] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [dislikedComments, setDislikedComments] = useState({});

  const postId = parseInt(id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
        <p className="mb-6">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/forum")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Forum
        </button>
      </div>
    );
  }

  const handleSubmitComment = (e) => {
    e.preventDefault();

    if (!comment.trim()) return;

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const author = userData.firstName || "Anonymous";

    onAddComment(postId, {
      id: post.comments.length + 1,
      text: comment,
      author,
      createdAt: new Date().toISOString(),
    });

    setComment("");
  };

  const toggleOptions = (commentId) => {
    setShowOptions(showOptions === commentId ? null : commentId);
  };

  const handleLikeComment = (commentId) => {
    // Toggle like state
    setLikedComments(prev => {
      const newState = { ...prev };
      newState[commentId] = !prev[commentId];
      
      // If we're liking, remove any dislike
      if (newState[commentId]) {
        setDislikedComments(prev => ({
          ...prev,
          [commentId]: false
        }));
      }
      
      return newState;
    });
    
    // Call parent handler if provided
    if (onLikeComment) {
      onLikeComment(postId, commentId, !likedComments[commentId]);
    }
  };

  const handleDislikeComment = (commentId) => {
    // Toggle dislike state
    setDislikedComments(prev => {
      const newState = { ...prev };
      newState[commentId] = !prev[commentId];
      
      // If we're disliking, remove any like
      if (newState[commentId]) {
        setLikedComments(prev => ({
          ...prev,
          [commentId]: false
        }));
      }
      
      return newState;
    });
    
    // Call parent handler if provided
    if (onDislikeComment) {
      onDislikeComment(postId, commentId, !dislikedComments[commentId]);
    }
  };

  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) return;

    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const author = userData.firstName || "Anonymous";

    // Add reply to the comment
    onAddComment(postId, {
      id: Date.now(), // Generate unique ID
      text: replyText,
      author,
      createdAt: new Date().toISOString(),
      parentId: commentId
    });

    setReplyText("");
    setReplyingTo(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Hidden on mobile, shown as top section */}
        <div className="hidden lg:block w-full lg:w-64 lg:flex-shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 sticky top-4">
            <Link
              to="/profile-edit"
              className="flex items-center gap-3 mb-6 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-10 h-10 bg-[#12153D] rounded-full flex items-center justify-center text-white">
                <i className="fa-solid fa-user"></i>
              </div>
              <span className="font-medium">Edit Profile</span>
            </Link>

            {/* <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">All Time:</span>
                <div className="relative">
                  <select className="appearance-none bg-transparent px-4 pr-8 py-2 outline-none text-sm border rounded-lg">
                    <option className="px-4">All Time</option>
                    <option>Today</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                    <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="mt-8 text-center hidden lg:block">
              <div className="bg-gray-100 h-40 rounded-lg flex items-center justify-center text-gray-500 font-medium shadow-inner">
                AD
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 order-1 lg:order-2">
          <button
            onClick={() => navigate("/forum")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#12153d] text-white hover:bg-gray-800 transition-colors w-fit mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="hidden sm:inline">Back to Posts</span>
          </button>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {post.authorImage ? (
                      <img
                        src={post.authorImage}
                        alt="Author"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {post.author?.charAt(0) || "A"}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-lg block">
                      {post.author || "Username"}
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        post.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>

              <h1 className="text-2xl font-bold mb-6">{post.title}</h1>

              {/* Post Content */}
              <div className="prose max-w-none">
                {post.contentType === "html" ? (
                  <div
                    className="text-gray-800 mb-6 forum-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    onClick={(e) => {
                      if (e.target.tagName === "A") {
                        e.stopPropagation();
                      }
                    }}
                  />
                ) : (
                  <p className="text-gray-800 mb-6">{post.content}</p>
                )}

                {post.image && (
                  <div className="mt-6">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
              <section id="comment">
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center gap-2 mb-6">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full py-3 px-4 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#12153d] border border-gray-200"
                    />
                    <button
                      onClick={handleSubmitComment}
                      className="bg-[#12153d] text-white p-3 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0"
                      aria-label="Send comment"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transform rotate-90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments
                        .filter(comment => !comment.parentId) // Only show top-level comments here
                        .map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-gray-50 p-4 rounded-lg"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  <span className="text-indigo-600 font-bold">
                                    {comment.author?.charAt(0) || "A"}
                                  </span>
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">
                                      {comment.author}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(
                                        comment.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-gray-700">
                                    {comment.text}
                                  </p>
                                  
                                  {/* Comment interaction buttons */}
                                  <div className="flex items-center mt-2 space-x-4">
                                    <button 
                                      className={`flex items-center text-xs space-x-1 ${likedComments[comment.id] ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                                      onClick={() => handleLikeComment(comment.id)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={likedComments[comment.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                      </svg>
                                      <span>{likedComments[comment.id] ? ((comment.likes || 0) + 1) : (comment.likes || 0)}</span>
                                    </button>
                                    
                                    <button 
                                      className={`flex items-center text-xs space-x-1 ${dislikedComments[comment.id] ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                                      onClick={() => handleDislikeComment(comment.id)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill={dislikedComments[comment.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                      </svg>
                                      <span>{dislikedComments[comment.id] ? ((comment.dislikes || 0) + 1) : (comment.dislikes || 0)}</span>
                                    </button>
                                    
                                    <button 
                                      className="flex items-center text-xs space-x-1 text-gray-500 hover:text-green-500"
                                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                      </svg>
                                      <span>Reply</span>
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => toggleOptions(comment.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>
                            </div>

                            {showOptions === comment.id && (
                              <div className="absolute right-4 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Edit
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                  Delete
                                </button>
                              </div>
                            )}
                            
                            {/* Reply input field */}
                            {replyingTo === comment.id && (
                              <div className="mt-3 pl-10">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="w-full py-2 px-3 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-[#12153d] border border-gray-200 text-sm"
                                  />
                                  <button
                                    onClick={() => handleReplySubmit(comment.id)}
                                    className="bg-[#12153d] text-white p-2 rounded-full hover:bg-blue-700 transition-colors flex-shrink-0"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {/* Display replies if any */}
                            {post.comments
                              .filter(reply => reply.parentId === comment.id)
                              .map(reply => (
                                <div key={reply.id} className="mt-3 pl-10 pt-3 border-t border-gray-100">
                                  <div className="flex items-start gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                      <span className="text-gray-600 font-bold text-sm">
                                        {reply.author?.charAt(0) || "A"}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">{reply.author}</span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(reply.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">{reply.text}</p>
                                      
                                      {/* Reply interaction buttons */}
                                      <div className="flex items-center mt-2 space-x-4">
                                        <button 
                                          className={`flex items-center text-xs space-x-1 ${likedComments[reply.id] ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                                          onClick={() => handleLikeComment(reply.id)}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill={likedComments[reply.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                          </svg>
                                          <span>{likedComments[reply.id] ? ((reply.likes || 0) + 1) : (reply.likes || 0)}</span>
                                        </button>
                                        
                                        <button 
                                          className={`flex items-center text-xs space-x-1 ${dislikedComments[reply.id] ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                                          onClick={() => handleDislikeComment(reply.id)}
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill={dislikedComments[reply.id] ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                                          </svg>
                                          <span>{dislikedComments[reply.id] ? ((reply.dislikes || 0) + 1) : (reply.dislikes || 0)}</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))
                            }
                          </div>
                        ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>
              </section>
              {/* Comments Section */}
            </div>
          </div>
        </div>

        {/* Right Advertisement */}
        <div className="hidden xl:block w-64 order-3">
          <div className="sticky top-4">
            <div className="bg-[#12153D] h-80 rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
              ADVERTISEMENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowForum;
