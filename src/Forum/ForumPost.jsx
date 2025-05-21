import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Configure base URL for API requests
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const ForumPosts = ({ post, onReact }) => {
  const [reacted, setReacted] = useState(post.userReacted || false);
  const [reactionType, setReactionType] = useState(post.userReaction || null);
  const navigate = useNavigate();

  // Check if user is admin
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isAdmin = userData.isAdmin || false;
  const isLoggedIn = !!localStorage.getItem("jwt");

  // Format creation date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const requireLogin = (action) => {
    toast.error("Please login to " + action);
  };

  const handlePostClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      requireLogin("view posts");
      return false;
    }
    return true;
  };

  const handleReaction = (e, type) => {
    if (!isLoggedIn) {
      e.preventDefault();
      requireLogin("react to posts");
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const newReactedState = !reacted || reactionType !== type;
    setReacted(newReactedState);
    setReactionType(newReactedState ? type : null);
    if (onReact) {
      onReact(post._id, newReactedState ? type : null);
    }

    if (window.innerWidth < 768) {
      const reactionMenu = e.currentTarget.parentNode.parentNode;
      reactionMenu.classList.add("opacity-0", "invisible");
      reactionMenu.classList.remove("opacity-100", "visible", "scale-100");
    }
  };

  const handleShare = (e, platform) => {
    if (!isLoggedIn) {
      e.preventDefault();
      requireLogin("share posts");
      return;
    }
    e.preventDefault();
    e.stopPropagation();

    const url = window.location.origin + `/forum/${post._id}`;

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(
            post.title + " - " + url
          )}`
        );
        break;
      case "discord":
        navigator.clipboard.writeText(`${post.title} - ${url}`);
        toast.success("Link copied to clipboard for sharing on Discord!");
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`
        );
        break;
      case "telegram":
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(post.title)}`
        );
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/forum/edit/${post._id}`);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetch(`${API_BASE_URL}/api/forum/${post._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401) {
            throw new Error("Unauthorized: Invalid or expired token");
          }
          if (response.status === 403) {
            throw new Error("Forbidden: Admin access required");
          }
          if (response.status === 404) {
            throw new Error(errorData.error || "Post not found");
          }
          throw new Error(`HTTP error: ${response.status}`);
        }

        toast.success("Post deleted successfully!");
        navigate("/forum");
      } catch (error) {
        console.error("Error deleting post:", error.message);
        toast.error(error.message || "Failed to delete post");
      }
    }
  };

  return (
    <div className="bg-white w-full md:w-[42rem] rounded-lg overflow-hidden border border-gray-200 transition-transform duration-300 hover:-translate-y-1">
      <Link
        to={`/forum/${post._id}`}
        className="block"
        onClick={handlePostClick}
      >
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2">
              {post.authorImage ? (
                <img
                  src={post.authorImage}
                  alt="Author"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {post.username || "Anonymous"}
            </span>
            <span className="text-sm text-gray-400 ml-2">
              • {formatDate(post.createdAt)}
            </span>
            {isAdmin && (
              <div className="ml-auto flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="text-blue-500 hover:text-blue-700"
                  title="Edit post"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700"
                  title="Delete post"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0V3h4v2m-7 2h10"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <h3 className="text-lg font-medium mb-2">{post.title}</h3>

          {post.contentType === "html" ? (
            <div
              className="text-sm text-gray-700 mb-4 forum-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-sm text-gray-700 mb-4">{post.content}</p>
          )}
        </div>

        {post.image && (
          <div className="w-full overflow-hidden max-h-[300px]">
            {post.contentType === "video" ? (
              <video
                src={post.image}
                alt={post.title}
                className="w-full h-full object-contain"
                controls
                muted
                playsInline
                onError={() => toast.error("Failed to load video")}
                style={{ maxHeight: "300px" }}
              />
            ) : (
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover"
              />
            )}
          </div>
        )}
      </Link>

      <div className="border-t border-gray-200 mt-2"></div>

      <div className="px-4 py-3 flex justify-start space-x-11">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <button
              className={`flex items-center space-x-1 ${
                reacted ? "text-blue-500" : "text-gray-500"
              } hover:text-blue-500 transition-colors`}
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  e.preventDefault();
                  e.stopPropagation();
                  const reactionMenu = e.currentTarget.nextElementSibling;
                  if (reactionMenu.classList.contains("opacity-0")) {
                    reactionMenu.classList.remove("opacity-0", "invisible");
                    reactionMenu.classList.add(
                      "opacity-100",
                      "visible",
                      "scale-100"
                    );
                  } else {
                    reactionMenu.classList.add("opacity-0", "invisible");
                    reactionMenu.classList.remove(
                      "opacity-100",
                      "visible",
                      "scale-100"
                    );
                  }
                } else {
                  handleReaction(e, "like");
                }
              }}
              onTouchStart={(e) => {
                if (window.innerWidth < 768) {
                  e.preventDefault();
                  const timer = setTimeout(() => {
                    const reactionMenu = e.currentTarget.nextElementSibling;
                    reactionMenu.classList.remove("opacity-0", "invisible");
                    reactionMenu.classList.add(
                      "opacity-100",
                      "visible",
                      "scale-100"
                    );
                  }, 500);
                  e.currentTarget.dataset.longPressTimer = timer;
                }
              }}
              onTouchEnd={(e) => {
                if (window.innerWidth < 768) {
                  const timer = e.currentTarget.dataset.longPressTimer;
                  if (timer) {
                    clearTimeout(timer);
                    delete e.currentTarget.dataset.longPressTimer;
                  }
                }
              }}
              onTouchMove={(e) => {
                if (window.innerWidth < 768) {
                  const timer = e.currentTarget.dataset.longPressTimer;
                  if (timer) {
                    clearTimeout(timer);
                    delete e.currentTarget.dataset.longPressTimer;
                  }
                }
              }}
            >
              {reactionType ? (
                <span className="text-xl" role="img" aria-label={reactionType}>
                  {reactionType === "like" && "👍"}
                  {reactionType === "love" && "❤️"}
                  {reactionType === "laugh" && "😂"}
                  {reactionType === "wow" && "😮"}
                  {reactionType === "angry" && "😡"}
                  {reactionType === "sad" && "😢"}
                </span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill={reacted ? "currentColor" : "none"}
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
              )}
              <span className="text-xs">
                {post.reactions
                  ? Object.values(post.reactions).reduce(
                      (sum, count) => sum + (count || 0),
                      0
                    )
                  : 0}
              </span>
            </button>

            <div
              className={`absolute bottom-full left-0 mb-2 transition-all duration-200 transform scale-95 origin-bottom-left ${"opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible md:group-hover:scale-100"} z-10`}
            >
              <div className="bg-white rounded-full shadow-lg p-1 flex space-x-1 border border-gray-200">
                <button
                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                  onClick={(e) => handleReaction(e, "like")}
                >
                  <span className="text-xl" role="img" aria-label="like">
                    👍
                  </span>
                </button>
                <button
                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  onClick={(e) => handleReaction(e, "love")}
                >
                  <span className="text-xl" role="img" aria-label="love">
                    ❤️
                  </span>
                </button>
                <button
                  className="p-1 hover:bg-yellow-100 rounded-full transition-colors"
                  onClick={(e) => handleReaction(e, "laugh")}
                >
                  <span className="text-xl" role="img" aria-label="laugh">
                    😂
                  </span>
                </button>
                <button
                  className="p-1 hover:bg-yellow-100 rounded-full transition-colors"
                  onClick={(e) => handleReaction(e, "wow")}
                >
                  <span className="text-xl" role="img" aria-label="wow">
                    😮
                  </span>
                </button>
                <button
                  className="p-1 hover:bg-orange-100 rounded-full transition-colors"
                  onClick={(e) => handleReaction(e, "angry")}
                >
                  <span className="text-xl" role="img" aria-label="angry">
                    😡
                  </span>
                </button>
                <button
                  className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                  onClick={(e) => handleReaction(e, "sad")}
                >
                  <span className="text-xl" role="img" aria-label="sad">
                    😢
                  </span>
                </button>
              </div>
              <div className="w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45 absolute -bottom-1.5 left-5"></div>
            </div>
          </div>

          <Link to={`/forum/${post._id}`}>
            <button
              className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors"
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  requireLogin("comment on posts");
                  return;
                }
                // Proceed with comment action
              }}
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
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span className="text-xs">
                {post.comments?.length ? post.comments.length : "No comments"}
              </span>
            </button>
          </Link>
        </div>

        <div className="relative group">
          <button
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (window.innerWidth < 768) {
                const shareMenu = e.currentTarget.nextElementSibling;
                if (shareMenu.classList.contains("opacity-0")) {
                  shareMenu.classList.remove("opacity-0", "invisible");
                  shareMenu.classList.add(
                    "opacity-100",
                    "visible",
                    "scale-100"
                  );
                } else {
                  shareMenu.classList.add("opacity-0", "invisible");
                  shareMenu.classList.remove(
                    "opacity-100",
                    "visible",
                    "scale-100"
                  );
                }
              }
            }}
            onTouchStart={(e) => {
              if (window.innerWidth < 768) {
                e.preventDefault();
                const timer = setTimeout(() => {
                  const shareMenu = e.currentTarget.nextElementSibling;
                  shareMenu.classList.remove("opacity-0", "invisible");
                  shareMenu.classList.add(
                    "opacity-100",
                    "visible",
                    "scale-100"
                  );
                }, 500);
                e.currentTarget.dataset.longPressTimer = timer;
              }
            }}
            onTouchEnd={(e) => {
              if (window.innerWidth < 768) {
                const timer = e.currentTarget.dataset.longPressTimer;
                if (timer) {
                  clearTimeout(timer);
                  delete e.currentTarget.dataset.longPressTimer;
                }
              }
            }}
            onTouchMove={(e) => {
              if (window.innerWidth < 768) {
                const timer = e.currentTarget.dataset.longPressTimer;
                if (timer) {
                  clearTimeout(timer);
                  delete e.currentTarget.dataset.longPressTimer;
                }
              }
            }}
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
                strokeWidth={1.5}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span className="text-xs">Share</span>
          </button>

          <div
            className={`absolute bottom-full left-0 mb-2 transition-all duration-200 transform scale-95 origin-bottom-left opacity-0 invisible md:group-hover:opacity-100 md:group-hover:visible md:group-hover:scale-100 z-10`}
          >
            <div className="bg-white rounded-full shadow-lg p-1 flex space-x-1 border border-gray-200">
              <button
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                onClick={(e) => handleShare(e, "whatsapp")}
              >
                <span className="text-xl" role="img" aria-label="whatsapp">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#fff"
                      d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                    ></path>
                    <path
                      fill="#cfd8dc"
                      d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                    ></path>
                    <path
                      fill="#40c351"
                      d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                    ></path>
                    <path
                      fill="#fff"
                      fillRule="evenodd"
                      d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </span>
              </button>
              <button
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                onClick={(e) => handleShare(e, "discord")}
              >
                <span className="text-xl" role="img" aria-label="discord">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#8c9eff"
                      d="M40,12c0,0-4.585-3.588-10-4l-0.488,0.976C34.408,10.174,36.654,11.891,39,14c-4.045-2.065-8.039-4-15-4s-10.955,1.935-15-4c2.346-2.109,5.018-4.015,9.488-5.024L18,8c-5.681,0.537-10,4-10,4s-5.121,7.425-6,22c5.162,5.953,13,6,13,6l1.639-2.185C13.857,36.848,10.715,35.121,8,32c3.238,2.45,8.125,5,16,5s12.762-2.55,16-5c-2.715,3.121-5.857,4.848-8.639,5.815L33,40c0,0,7.838-0.047,13-6C45.121,19.425,40,12,40,12z M17.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C21,28.209,19.433,30,17.5,30z M30.5,30c-1.933,0-3.5-1.791-3.5-4c0-2.209,1.567-4,3.5-4s3.5,1.791,3.5,4C34,28.209,32.433,30,30.5,30z"
                    ></path>
                  </svg>
                </span>
              </button>
              <button
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                onClick={(e) => handleShare(e, "facebook")}
              >
                <span className="text-xl" role="img" aria-label="facebook">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#3F51B5"
                      d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                    ></path>
                    <path
                      fill="#FFF"
                      d="M34.368,25H31v13h-5V25h-3v-4h3v-2.41c0.002-3.508,1.459-5.59,5.592-5.59H35v4h-2.287C31.104,17,31,17.6,31,18.723V21h4L34.368,25z"
                    ></path>
                  </svg>
                </span>
              </button>
              <button
                className="p-1 hover:bg-blue-100 rounded-full transition-colors"
                onClick={(e) => handleShare(e, "telegram")}
              >
                <span className="text-xl" role="img" aria-label="telegram">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#29b6f6"
                      d="M24,4C13,4,4,13,4,24s9,20,20,20s20-9,20-20S35,4,24,4z"
                    ></path>
                    <path
                      fill="#fff"
                      d="M34,15l-3.7,19.1c0,0-0.2,0.9-1.2,0.9c-0.6,0-0.9-0.3-0.9-0.3L20,28l-4-2l-5.1-1.4c0,0-0.9-0.3-0.9-1 c0-0.6,0.9-0.9,0.9-0.9l21.3-8.5c0,0,0.7-0.2,1.1-0.2c0.3,0,0.6,0.1,0.6,0.5C34,14.8,34,15,34,15z"
                    ></path>
                    <path
                      fill="#cfd8dc"
                      d="M29.9,18.2c-0.2-0.2-0.5-0.3-0.7-0.1L16,26c0,0,2.1,5.9,2.4,6.9c0.3,1,0.6,1,0.6,1l1-6l9.8-9.1 C30,18.7,30.1,18.4,29.9,18.2z"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className="w-3 h-3 bg-white border-l border-b border-gray-200 transform rotate-45 absolute -bottom-1.5 left-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPosts;

// Define isLoggedIn based on user data
