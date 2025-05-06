import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import TextEditor from "../Components/TextEditor/TextEditor.jsx";

const ShowForum = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [error, setError] = useState(null);
  const [showOptions, setShowOptions] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [likedComments, setLikedComments] = useState({});
  const [dislikedComments, setDislikedComments] = useState({});

  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch post on mount
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}`
        );
        setPost(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to load post. Please try again.");
        setPost(null);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!comment.trim() && !commentImage) return;

    try {
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      const author =
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
        "Anonymous";
      const token = localStorage.getItem("jwt");

      const formData = new FormData();
      formData.append("content", comment);
      formData.append("author", author);
      if (commentImage) {
        formData.append("image", commentImage);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}/comments`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update post with new comment
      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), response.data],
      }));
      setComment("");
      setCommentImage(null);
      document.getElementById("comment-image-upload").value = "";
      document.getElementById("comment-image-preview").classList.add("hidden");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      const author =
        `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
        "Anonymous";
      const token = localStorage.getItem("jwt");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}/comments`,
        {
          content: replyText,
          author,
          parentId: commentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), response.data],
      }));
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("Failed to add reply. Please try again.");
    }
  };

  const toggleOptions = (commentId) => {
    setShowOptions(showOptions === commentId ? null : commentId);
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const isLiked = likedComments[commentId];
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/forum/posts/${id}/comments/${commentId}/${
          isLiked ? "unlike" : "like"
        }`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setDislikedComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));

      // Update comment likes
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? { ...c, likes: isLiked ? (c.likes || 0) - 1 : (c.likes || 0) + 1 }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
      alert("Failed to like comment.");
    }
  };

  const handleDislikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      const isDisliked = dislikedComments[commentId];
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/forum/posts/${id}/comments/${commentId}/${
          isDisliked ? "undislike" : "dislike"
        }`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDislikedComments((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: false,
      }));

      // Update comment dislikes
      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                dislikes: isDisliked
                  ? (c.dislikes || 0) - 1
                  : (c.dislikes || 0) + 1,
              }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error disliking comment:", error);
      alert("Failed to dislike comment.");
    }
  };

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="mb-6 text-red-500">{error}</p>
        <button
          onClick={() => navigate("/forum")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Back to Forum
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
     
     <div className="space-y-4">
                {[1, 2].map((index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm animate-pulse w-full"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar skeleton */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex-shrink-0"></div>

                      <div className="flex-1 space-y-3 w-full">
                        {/* Title skeleton */}
                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-4/5"></div>

                        {/* Content skeleton */}
                        <div className="space-y-2">
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>

                        {/* Tags skeleton */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <div className="h-5 sm:h-6 w-16 sm:w-20 bg-gray-200 rounded"></div>
                          <div className="h-5 sm:h-6 w-20 sm:w-24 bg-gray-200 rounded"></div>
                        </div>

                        {/* Reactions skeleton */}
                        <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
                          <div className="h-7 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded"></div>
                          <div className="h-7 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded"></div>
                          <div className="h-7 sm:h-8 w-16 sm:w-20 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
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
          </div>
          <div className="mt-8 text-center  ">
            <div className="bg-gray-200   w-[250px] h-[250px] rounded-lg flex items-center justify-center text-gray-500 font-medium">
              AD
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
                    {post.profileImage ? (
                      <img
                        src={post.profileImage}
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
                      {post.username}
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
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

              {/* Comments Section */}
              <section id="comment">
                <div className="mt-8 border-t pt-6">
                  <div className="flex flex-col gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full py-3 px-4 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#12153d] border border-gray-200"
                      />
                      <label
                        htmlFor="comment-image-upload"
                        className="cursor-pointer p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <input
                          type="file"
                          id="comment-image-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setCommentImage(file);
                              const reader = new FileReader();
                              reader.onload = function (e) {
                                const previewDiv = document.getElementById(
                                  "comment-image-preview"
                                );
                                const previewImg =
                                  previewDiv.querySelector("img");
                                previewImg.src = e.target.result;
                                previewDiv.classList.remove("hidden");
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setCommentImage(null);
                            }
                          }}
                        />
                      </label>
                      <button
                        onClick={handleSubmitComment}
                        className="bg-[#12153d] text-white p-3 rounded-full cursor-pointer hover:bg-[#12153d]/90 transition-colors flex-shrink-0"
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

                    {/* Preview area for selected image */}
                    <div
                      id="comment-image-preview"
                      className="hidden mt-2 relative"
                    >
                      <img
                        src=""
                        alt="Preview"
                        className="max-h-40 rounded-lg"
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        onClick={() => {
                          setCommentImage(null);
                          document.getElementById(
                            "comment-image-upload"
                          ).value = "";
                          document
                            .getElementById("comment-image-preview")
                            .classList.add("hidden");
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments
                        .filter((comment) => !comment.parentId)
                        .map((comment) => (
                          <div
                            key={comment._id}
                            className="bg-gray-50 p-4 rounded-lg relative"
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
                                    {comment.content}
                                  </p>
                                  {comment.image && (
                                    <img
                                      src={comment.image}
                                      alt="Comment attachment"
                                      className="mt-2 max-w-xs rounded-lg"
                                    />
                                  )}
                                  <div className="flex items-center mt-2 space-x-4">
                                    <button
                                      className={`flex items-center text-xs space-x-1 ${
                                        likedComments[comment._id]
                                          ? "text-blue-500"
                                          : "text-gray-500"
                                      } hover:text-blue-500`}
                                      onClick={() =>
                                        handleLikeComment(comment._id)
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill={
                                          likedComments[comment._id]
                                            ? "currentColor"
                                            : "none"
                                        }
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1.5}
                                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h-.095c-.5 0-.905.405-.905.905 0 .714.211 1.412.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                        />
                                      </svg>
                                      <span>
                                        {(comment.likes || 0) +
                                          (likedComments[comment._id] ? 1 : 0)}
                                      </span>
                                    </button>
                                    <button
                                      className={`flex items-center text-xs space-x-1 ${
                                        dislikedComments[comment._id]
                                          ? "text-red-500"
                                          : "text-gray-500"
                                      } hover:text-red-500`}
                                      onClick={() =>
                                        handleDislikeComment(comment._id)
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill={
                                          dislikedComments[comment._id]
                                            ? "currentColor"
                                            : "none"
                                        }
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1.5}
                                          d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c-.5 0-.905-.405-.905-.905 0 .714.211 1.412.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                        />
                                      </svg>
                                      <span>
                                        {(comment.dislikes || 0) +
                                          (dislikedComments[comment._id]
                                            ? 1
                                            : 0)}
                                      </span>
                                    </button>
                                    <button
                                      className="flex items-center text-xs space-x-1 text-gray-500 hover:text-green-500"
                                      onClick={() =>
                                        setReplyingTo(
                                          replyingTo === comment._id
                                            ? null
                                            : comment._id
                                        )
                                      }
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1.5}
                                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                                        />
                                      </svg>
                                      <span>Reply</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={() => toggleOptions(comment._id)}
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
                            {showOptions === comment._id && (
                              <div className="absolute right-4 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                  Edit
                                </button>
                                <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                  Delete
                                </button>
                              </div>
                            )}
                            {replyingTo === comment._id && (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Write a reply..."
                                    value={replyText}
                                    onChange={(e) =>
                                      setReplyText(e.target.value)
                                    }
                                    className="w-full mt-4 py-2 px-3 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-[#12153d] border border-gray-200 text-sm"
                                  />
                                  <button
                                    onClick={() =>
                                      handleReplySubmit(comment._id)
                                    }
                                    className="bg-[#12153d] text-white p-2 rounded-full hover:bg-[#12153d]/90 cursor-pointer transition-colors flex-shrink-0"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4 rotate-90"
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
                              </div>
                            )}
                            {post.comments
                              .filter((reply) => reply.parentId === comment._id)
                              .map((reply) => (
                                <div
                                  key={reply._id}
                                  className="mt-3 pl-10 pt-3 border-t border-gray-100"
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                      <span className="text-gray-600 font-bold text-sm">
                                        {reply.author?.charAt(0) || "A"}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-sm">
                                          {reply.author}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(
                                            reply.createdAt
                                          ).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">
                                        {reply.content}
                                      </p>
                                      {reply.image && (
                                        <img
                                          src={reply.image}
                                          alt="Reply attachment"
                                          className="mt-2 max-w-xs rounded-lg"
                                        />
                                      )}
                                      <div className="flex items-center mt-2 space-x-4">
                                        <button
                                          className={`flex items-center text-xs space-x-1 ${
                                            likedComments[reply._id]
                                              ? "text-blue-500"
                                              : "text-gray-500"
                                          } hover:text-blue-500`}
                                          onClick={() =>
                                            handleLikeComment(reply._id)
                                          }
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            fill={
                                              likedComments[reply._id]
                                                ? "currentColor"
                                                : "none"
                                            }
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714.211 1.412.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                            />
                                          </svg>
                                          <span>
                                            {(reply.likes || 0) +
                                              (likedComments[reply._id]
                                                ? 1
                                                : 0)}
                                          </span>
                                        </button>
                                        <button
                                          className={`flex items-center text-xs space-x-1 ${
                                            dislikedComments[reply._id]
                                              ? "text-red-500"
                                              : "text-gray-500"
                                          } hover:text-red-500`}
                                          onClick={() =>
                                            handleDislikeComment(reply._id)
                                          }
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            fill={
                                              dislikedComments[reply._id]
                                                ? "currentColor"
                                                : "none"
                                            }
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={1.5}
                                              d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c-.5 0-.905-.405-.905-.905 0 .714.211 1.412.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                            />
                                          </svg>
                                          <span>
                                            {(reply.dislikes || 0) +
                                              (dislikedComments[reply._id]
                                                ? 1
                                                : 0)}
                                          </span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
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
            </div>
          </div>
        </div>

        {/* Right Advertisement */}
        <div className="hidden xl:block w-64 order-3">
          <div className="sticky top-4">
            <div className="bg-[#12153D] w-[300px] h-[250px] rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
              ADVERTISEMENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowForum;
