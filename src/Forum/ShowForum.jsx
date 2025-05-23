import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  // Parse author field (JSON string, plain string, or object)
  const parseAuthor = (author) => {
    if (typeof author === "string") {
      try {
        if (author.startsWith("{")) {
          const parsed = JSON.parse(author);
          return { username: parsed.username || "Anonymous", profileImage: parsed.profileImage };
        }
        return { username: author, profileImage: null };
      } catch (e) {
        console.warn(`Failed to parse author: ${author}`);
        return { username: "Anonymous", profileImage: null };
      }
    }
    return author || { username: "Anonymous", profileImage: null };
  };

  // Fetch post on mount
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${baseUrl}/api/forum/posts/${id}`);
        console.log("Post data:", response.data);
        setPost(response.data);
        const userId = JSON.parse(localStorage.getItem("userData"))?._id;
        const initialLikes = {};
        const initialDislikes = {};
        response.data.comments.forEach((comment) => {
          initialLikes[comment._id] = comment.likedBy?.includes(userId) || false;
          initialDislikes[comment._id] =
            comment.dislikedBy?.includes(userId) || false;
        });
        setLikedComments(initialLikes);
        setDislikedComments(initialDislikes);
        setError(null);
      } catch (error) {
        console.error("Error fetching post:", error);
        if (error.response?.status === 404) {
          setError("Post not found.");
        } else if (error.response?.status === 401) {
          setError("Please log in to view this post.");
        } else {
          setError("Failed to load post. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() && !commentImage) {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Please log in to comment.");
        return;
      }

      const formData = new FormData();
      formData.append("content", comment);
      formData.append("author", `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Anonymous");
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

      setPost((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), response.data],
      }));
      setComment("");
      setCommentImage(null);
      document.getElementById("comment-image-upload").value = "";
      document.getElementById("comment-image-preview").classList.add("hidden");
      toast.success("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again.");
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty.");
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      if (!userData) {
        toast.error("Please log in to reply.");
        return;
      }
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Please log in to reply.");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}/comments`,
        {
          content: replyText,
          author: `${userData.firstName || ""} ${userData.lastName || ""}`.trim() || "Anonymous",
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
      toast.success("Reply added successfully!");
    } catch (error) {
      console.error("Error adding reply:", error);
      toast.error("Failed to add reply. Please try again.");
    }
  };

  const handleEditComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      console.log("JWT Token for edit:", token);
      if (!token) {
        toast.error("Please log in to edit comments.");
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}/comments/${commentId}`,
        { content: editText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId ? { ...c, content: response.data.content } : c
        ),
      }));
      setEditingCommentId(null);
      setEditText("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      console.error("Error editing comment:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("jwt");
        navigate("/login");
      } else {
        toast.error("Failed to edit comment. Please try again.");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      const token = localStorage.getItem("jwt");
      console.log("JWT Token for delete:", token);
      if (!token) {
        toast.error("Please log in to delete comments.");
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${id}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      setShowOptions(null);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("jwt");
        navigate("/login");
      } else {
        toast.error("Failed to delete comment. Please try again.");
      }
    }
  };

  const toggleOptions = (commentId) => {
    setShowOptions(showOptions === commentId ? null : commentId);
  };

  const handleLikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Please log in to like comments.");
        return;
      }
      const isLiked = likedComments[commentId];
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/forum/posts/${id}/comments/${commentId}/${isLiked ? "unlike" : "like"}`,
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

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                likes: isLiked ? (c.likes || 0) - 1 : (c.likes || 0) + 1,
                dislikes: dislikedComments[commentId]
                  ? (c.dislikes || 0) - 1
                  : c.dislikes,
              }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error liking comment:", error);
      toast.error("Failed to like comment.");
    }
  };

  const handleDislikeComment = async (commentId) => {
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Please log in to dislike comments.");
        return;
      }
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

      setPost((prev) => ({
        ...prev,
        comments: prev.comments.map((c) =>
          c._id === commentId
            ? {
                ...c,
                dislikes: isDisliked
                  ? (c.dislikes || 0) - 1
                  : (c.dislikes || 0) + 1,
                likes: likedComments[commentId]
                  ? (c.likes || 0) - 1
                  : c.likes,
              }
            : c
        ),
      }));
    } catch (error) {
      console.error("Error disliking comment:", error);
      toast.error("Failed to dislike comment.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="animate-pulse mb-6">
          <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="hidden lg:block w-full lg:w-64 lg:flex-shrink-0 order-2 lg:order-1">
            <div className="bg-gray-100 rounded-lg p-4 mb-4 h-40">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <div className="bg-gray-100 w-full h-[250px] rounded-lg"></div>
            </div>
          </div>
          <div className="flex-1 order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                    <div>
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded-lg w-full mb-8"></div>
                <div className="mt-8 border-t pt-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-12 bg-gray-200 rounded-full flex-1"></div>
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="bg-gray-100 p-4 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex-shrink-0"></div>
                          <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                            <div className="flex gap-4 mt-2">
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                              <div className="h-4 bg-gray-200 rounded w-16"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row gap-6">
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
          <div className="mt-8 text-center">
            <div className="bg-gray-200 w-[250px] h-[250px] rounded-lg flex items-center justify-center text-gray-500 font-medium">
              AD
            </div>
          </div>
        </div>

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
                    {post.author?.profileImage ? (
                      <img
                        src={post.author.profileImage}
                        alt={post.author?.username || "Author"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {post.author?.username?.charAt(0) || "A"}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-lg block">
                      {post.author?.username || "Anonymous"}
                    </span>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-6">{post.title}</h1>

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
                    {post.contentType === "video" ? (
                      <video
                        src={post.image}
                        alt={post.title}
                        title={post.title}
                        className="w-full rounded-lg shadow-md"
                        controls
                        muted
                        playsInline
                        onError={() => toast.error("Failed to load video.")}
                      />
                    ) : (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full rounded-lg shadow-md"
                      />
                    )}
                  </div>
                )}
              </div>

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
                          accept="image/jpeg,image/png,image/gif,video/mp4,video/webm,video/quicktime"
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
                                const previewVideo =
                                  previewDiv.querySelector("video");
                                if (file.type.startsWith("video/")) {
                                  previewVideo.src = e.target.result;
                                  previewVideo.classList.remove("hidden");
                                  previewImg.classList.add("hidden");
                                } else {
                                  previewImg.src = e.target.result;
                                  previewImg.classList.remove("hidden");
                                  previewVideo.classList.add("hidden");
                                }
                                previewDiv.classList.remove("hidden");
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setCommentImage(null);
                              document.getElementById(
                                "comment-image-preview"
                              ).classList.add("hidden");
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

                    <div
                      id="comment-image-preview"
                      className="hidden mt-2 relative"
                    >
                      <img
                        src=""
                        alt="Preview"
                        className="max-h-40 rounded-lg hidden"
                      />
                      <video
                        src=""
                        alt="Preview"
                        className="max-h-40 rounded-lg hidden"
                        controls
                        muted
                        playsInline
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
                        .map((comment) => {
                          const author = parseAuthor(comment.author);
                          return (
                            <div
                              key={comment._id}
                              className="bg-gray-50 p-4 rounded-lg relative"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {author.profileImage ? (
                                      <img
                                        src={author.profileImage}
                                        alt={author.username}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-indigo-600 font-bold">
                                        {author.username.charAt(0) || "A"}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">
                                        {author.username}
                                      </span>
                                      <span className="text-xs text-gray-500">
                                        {new Date(
                                          comment.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>
                                    {editingCommentId === comment._id ? (
                                      <div className="flex flex-col gap-2">
                                        <input
                                          type="text"
                                          value={editText}
                                          onChange={(e) =>
                                            setEditText(e.target.value)
                                          }
                                          className="w-full py-2 px-3 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-[#12153d] border border-gray-200 text-sm"
                                        />
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() =>
                                              handleEditComment(comment._id)
                                            }
                                            className="bg-[#12153d] text-white px-3 py-1 rounded-full hover:bg-[#12153d]/90 transition-colors"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={() => {
                                              setEditingCommentId(null);
                                              setEditText("");
                                            }}
                                            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-400 transition-colors"
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <div
                                          className="mt-1 text-gray-700"
                                          dangerouslySetInnerHTML={{ __html: comment.content }}
                                        />
                                        {comment.image &&
                                          (comment.image.includes("video/") ? (
                                            <video
                                              src={comment.image}
                                              alt="Comment attachment"
                                              className="mt-2 max-w-xs rounded-lg"
                                              controls
                                              muted
                                              playsInline
                                            />
                                          ) : (
                                            <img
                                              src={comment.image}
                                              alt="Comment attachment"
                                              className="mt-2 max-w-xs rounded-lg"
                                            />
                                          ))}
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
                                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                              />
                                            </svg>
                                            <span>{comment.likes || 0}</span>
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
                                              width="20px"
                                              height="20px"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              fill={
                                                dislikedComments[comment._id]
                                                  ? "currentColor"
                                                  : "none"
                                              }
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M15.0501 16.9558C15.4673 18.2075 14.5357 19.5 13.2164 19.5C12.5921 19.5 12.0063 19.1985 11.6435 18.6906L8.47164 14.25L5.85761 14.25L5.10761 13.5L5.10761 6L5.85761 5.25L16.8211 5.25L19.1247 9.85722C19.8088 11.2253 19.5407 12.8776 18.4591 13.9592C17.7927 14.6256 16.8888 15 15.9463 15L14.3982 15L15.0501 16.9558ZM9.60761 13.2596L12.8641 17.8187C12.9453 17.9325 13.0765 18 13.2164 18C13.5119 18 13.7205 17.7105 13.6271 17.4302L12.317 13.5L15.9463 13.5C16.491 13.5 17.0133 13.2836 17.3984 12.8985C18.0235 12.2735 18.1784 11.3186 17.7831 10.528L15.8941 6.75L9.60761 6.75L9.60761 13.2596ZM8.10761 6.75L6.60761 6.75L6.60761 12.75L8.10761 12.75L8.10761 6.75Z"
                                              />
                                            </svg>
                                            <span>{comment.dislikes || 0}</span>
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
                                      </>
                                    )}
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
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                      setEditingCommentId(comment._id);
                                      setEditText(comment.content);
                                      setShowOptions(null);
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    onClick={() => handleDeleteComment(comment._id)}
                                  >
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
                                .map((reply) => {
                                  const replyAuthor = parseAuthor(reply.author);
                                  return (
                                    <div
                                      key={reply._id}
                                      className="mt-3 pl-10 pt-3 border-t border-gray-100"
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                          {replyAuthor.profileImage ? (
                                            <img
                                              src={replyAuthor.profileImage}
                                              alt={replyAuthor.username}
                                              className="h-full w-full object-cover"
                                            />
                                          ) : (
                                            <span className="text-gray-600 font-bold text-sm">
                                              {replyAuthor.username.charAt(0) || "A"}
                                            </span>
                                          )}
                                        </div>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span className="font-medium text-sm">
                                              {replyAuthor.username}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                              {new Date(
                                                reply.createdAt
                                              ).toLocaleDateString()}
                                            </span>
                                          </div>
                                          <div
                                            className="text-sm text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: reply.content }}
                                          />
                                          {reply.image && (
                                            reply.image.includes("video/") ? (
                                              <video
                                                src={reply.image}
                                                alt="Reply attachment"
                                                className="mt-2 max-w-xs rounded-lg"
                                                controls
                                                muted
                                                playsInline
                                              />
                                            ) : (
                                              <img
                                                src={reply.image}
                                                alt="Reply attachment"
                                                className="mt-2 max-w-xs rounded-lg"
                                              />
                                            )
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
                                                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                                />
                                              </svg>
                                              <span>{reply.likes || 0}</span>
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
                                                width="20px"
                                                height="20px"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                fill={
                                                  dislikedComments[reply._id]
                                                    ? "currentColor"
                                                    : "none"
                                                }
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  fillRule="evenodd"
                                                  clipRule="evenodd"
                                                  d="M15.0501 16.9558C15.4673 18.2075 14.5357 19.5 13.2164 19.5C12.5921 19.5 12.0063 19.1985 11.6435 18.6906L8.47164 14.25L5.85761 14.25L5.10761 13.5L5.10761 6L5.85761 5.25L16.8211 5.25L19.1247 9.85722C19.8088 11.2253 19.5407 12.8776 18.4591 13.9592C17.7927 14.6256 16.8888 15 15.9463 15L14.3982 15L15.0501 16.9558ZM9.60761 13.2596L12.8641 17.8187C12.9453 17.9325 13.0765 18 13.2164 18C13.5119 18 13.7205 17.7105 13.6271 17.4302L12.317 13.5L15.9463 13.5C16.491 13.5 17.0133 13.2836 17.3984 12.8985C18.0235 12.2735 18.1784 11.3186 17.7831 10.528L15.8941 6.75L9.60761 6.75L9.60761 13.2596ZM8.10761 6.75L6.60761 6.75L6.60761 12.75L8.10761 12.75L8.10761 6.75Z"
                                                />
                                              </svg>
                                              <span>{reply.dislikes || 0}</span>
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          );
                        })
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

        <div className="hidden xl:block w-64 order-3">
          <div className="sticky top-4">
            <div className="bg-[#12153D] w-[300px] h-[250px] rounded-lg flex items-center justify-center text-white font-medium shadow-lg">
              ADVERTISEMENT
            </div>
          </div>
        </div>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ShowForum;