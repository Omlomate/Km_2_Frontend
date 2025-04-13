import React, { useState } from "react";

const UserForum = () => {
  const [activeTab, setActiveTab] = useState("posts");

  // Sample forum data with additional user info
  const forumPosts = [
    {
      id: 1,
      title: "What is SEO?",
      content:
        "Question, or query or thought question, or query or thought question, or query or question, or query or thought question, or query or thought question, or query or?",
      likes: 12,
      comments: 5,
      shares: 3,
      isUserPost: true,
      isLikedByUser: false,
      isSharedByUser: true,
      userComments: [
        { id: 101, text: "This is my comment on SEO" }
      ]
    },
    {
      id: 2,
      title: "What is SEO?",
      content:
        "Question, or query or thought question, or query or thought question, or query or question, or query or thought question, or query or thought question, or query or?",
      likes: 8,
      comments: 3,
      shares: 1,
      isUserPost: false,
      isLikedByUser: true,
      isSharedByUser: false,
      userComments: []
    },
    {
      id: 3,
      title: "How to optimize website speed?",
      content:
        "Question, or query or thought question, or query or thought question, or query or question, or query or thought question, or query or thought question, or query or?",
      likes: 15,
      comments: 7,
      shares: 4,
      isUserPost: false,
      isLikedByUser: true,
      isSharedByUser: true,
      userComments: [
        { id: 102, text: "Great tips for optimization!" },
        { id: 103, text: "I've tried this and it works well" }
      ]
    },
  ];

  // Filter posts based on active tab
  const getFilteredPosts = () => {
    switch (activeTab) {
      case "posts":
        return forumPosts.filter(post => post.isUserPost);
      case "comments":
        return forumPosts.filter(post => post.userComments.length > 0);
      case "liked":
        return forumPosts.filter(post => post.isLikedByUser);
      case "shared":
        return forumPosts.filter(post => post.isSharedByUser);
      default:
        return forumPosts;
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
        <button
          onClick={() => setActiveTab("shared")}
          className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-300 ${
            activeTab === "shared"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } rounded-t-md mb-2 sm:mb-0`}
        >
          shared
        </button>
      </div>

      {/* Forum Posts */}
      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="border-b border-gray-200 pb-4">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                {post.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3">{post.content}</p>
              
              {/* Show user comments if on comments tab */}
              {activeTab === "comments" && post.userComments.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-md mb-3">
                  <h3 className="text-sm font-medium mb-2">Your comments:</h3>
                  {post.userComments.map(comment => (
                    <p key={comment.id} className="text-xs text-gray-600 mb-1 pl-2 border-l-2 border-gray-300">
                      {comment.text}
                    </p>
                  ))}
                </div>
              )}
              
              <div className="flex flex-wrap text-xs text-gray-500">
                <span className={`mr-4 mb-1 ${post.isLikedByUser ? 'text-blue-600 font-medium' : ''}`}>
                  {post.likes} likes {post.isLikedByUser && '(including yours)'}
                </span>
                <span className="mr-4 mb-1">
                  {post.comments} comments {post.userComments.length > 0 && `(${post.userComments.length} by you)`}
                </span>
                <span className={`mb-1 ${post.isSharedByUser ? 'text-blue-600 font-medium' : ''}`}>
                  {post.shares} shares {post.isSharedByUser && '(including yours)'}
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
