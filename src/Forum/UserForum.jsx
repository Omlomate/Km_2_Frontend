import React, { useState, useEffect } from "react";

const UserForum = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwt");
        if (!token) {
          throw new Error("Please log in to view your activity");
        }

        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/forum/user-activity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user activity");
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "posts":
        return posts.filter((post) => post.isUserPost);
      case "comments":
        return posts.filter((post) => post.userComments.length > 0);
      case "liked":
        return posts.filter((post) => post.isLikedByUser);
      default:
        return posts;
    }
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
            activeTab === "posts"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } rounded-t-md mr-3 mb-2 sm:mb-0`}
        >
          posts
        </button>
        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
            activeTab === "comments"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } rounded-t-md mr-3 mb-2 sm:mb-0`}
        >
          comments
        </button>
        <button
          onClick={() => setActiveTab("liked")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
            activeTab === "liked"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } rounded-t-md mr-3 mb-2 sm:mb-0`}
        >
          liked
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 pb-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {post.title}
              </h2>
              <div
                className="text-xs sm:text-sm text-gray-600 mb-3"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Show user comments if on comments tab */}
              {activeTab === "comments" && post.userComments.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <h3 className="text-sm font-medium mb-2">Your comments:</h3>
                  {post.userComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="text-xs text-gray-600 mb-1 pl-2 border-l-2 border-gray-300"
                      dangerouslySetInnerHTML={{ __html: comment.text }}
                    />
                  ))}
                </div>
              )}

              <div className="flex flex-wrap text-xs text-gray-500">
                <span
                  className={`mr-4 mb-1 ${
                    post.isLikedByUser ? "text-blue-600 font-medium" : ""
                  }`}
                >
                  {post.likes} likes {post.isLikedByUser && "(including yours)"}
                </span>
                <span className="mr-4 mb-1">
                  {post.comments} comments{" "}
                  {post.userComments.length > 0 &&
                    `(${post.userComments.length} by you)`}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No {activeTab} to display</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForum;