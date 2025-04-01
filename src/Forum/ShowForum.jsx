import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ForumPosts from "./ForumPost.jsx";

const ShowForum = ({ posts, onAddComment }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [showOptions, setShowOptions] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto bg-white min-h-screen mt-4">
      <button
        onClick={() => navigate("/forum")}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#12153d] text-white hover:bg-gray-800 transition-colors"
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
        Back to Posts
      </button>
      <div className="p-4 mt-4 bg-gray-100">
        <div className="mt-4">
          <div className="rounded-lg p-4 ">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
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
                <div className="ml-3">
                  <span className="font-medium text-lg">
                    {post.author || "Username"}
                  </span>
                  <p className="text-xs text-gray-500">
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
          </div>
        </div>
        <div className="mt-4 px-2">
          <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-800 mb-6">{post.content}</p>

          {post.image && (
            <div className="mb-6">
              <img
                src={post.image}
                alt={post.title}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <div className="py-4 mt-6 px-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="add comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full py-2 px-3 rounded-l-full bg-gray-100 focus:outline-none border-[#12153d] border-1"
            // onKeyPress={(e) => e.key === "Enter" && handleSubmitComment(e)}
          />
          <button 
            onClick={handleSubmitComment}
            className="bg-[#12153d] text-white px-4 py-[12px] rounded-r-full hover:bg-blue-700 transition-colors flex items-center justify-center"
            aria-label="Send comment"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      <div className="comments-section">
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment) => (
            <div key={comment.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                  <span className="text-white font-bold">
                    {comment.author?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">Username</span>
                    <div className="relative">
                      <button
                        onClick={() => toggleOptions(comment.id)}
                        className="text-gray-500"
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
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                      {showOptions === comment.id && (
                        <div className="absolute right-0 mt-1 w-40 bg-white shadow-lg rounded-md overflow-hidden z-10 border">
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                            not interested
                          </button>
                          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700">
                            report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-gray-800">{comment.text}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-blue-500">
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-500">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                    <button className="text-gray-500 hover:text-blue-500">
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowForum;
