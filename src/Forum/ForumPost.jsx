import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForumPosts = ({ post, onReact }) => {
  const [reacted, setReacted] = useState(post.userReacted || false);
  const [reactionType, setReactionType] = useState(post.userReaction || null);

  const handleReaction = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (reacted && reactionType !== type) {
      // Prevent changing to a different reaction
      return;
    }
    const newReactedState = !reacted || reactionType !== type;
    setReacted(newReactedState);
    setReactionType(newReactedState ? type : null);
    if (onReact) {
      onReact(post._id, newReactedState ? type : null);
    }
  };

  return (
    <div className="bg-white w-full md:w-[44rem] rounded-lg overflow-hidden border border-gray-200 transition-transform duration-300 hover:-translate-y-1">
      <Link to={`/forum/${post._id}`} className="block">
        <div className="p-4">
          {/* Author info */}
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
              {post.author || "Anonymous"}
            </span>
            <div className="ml-auto flex items-center">
              {/* Comment count icons removed for brevity */}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium mb-2">{post.title}</h3>

          {/* Content - always display regardless of image */}
          {post.contentType === "html" ? (
            <div
              className="text-sm text-gray-700 mb-4 forum-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-sm text-gray-700 mb-4">{post.content}</p>
          )}
        </div>

        {/* Image - only show if exists */}
        {post.image && (
          <div className="w-full overflow-hidden max-h-[300px]">
            <img
              src={post.image}
              alt={post.title}
              className="w-full object-cover"
            />
          </div>
        )}
      </Link>

      {/* Horizontal line for separation */}
      <div className="border-t border-gray-200 mt-2"></div>

      {/* Interaction options row */}
      <div className="px-4 py-3 flex justify-start space-x-11">
        <div className="flex items-center space-x-6">
          {/* Reaction button */}
          <div className="relative group">
            <button
              className={`flex items-center space-x-1 ${
                reacted ? "text-blue-500" : "text-gray-500"
              } hover:text-blue-500 transition-colors`}
              onClick={(e) => handleReaction(e, "like")}
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
                  ? Object.values(post.reactions).reduce((sum, count) => sum + (count || 0), 0)
                  : 0}
              </span>
            </button>

            {/* Reaction panel - appears on hover, disabled if reacted */}
            <div className={`absolute bottom-full left-0 mb-2 transition-all duration-200 transform scale-95 origin-bottom-left ${reacted ? 'opacity-0 invisible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100'}`}>
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

          {/* Comment button */}
          <Link to={`/forum/${post._id}`}>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
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

        {/* Share button */}
        <button className="flex items-center space-x-1 text-gray-500 hover:text-purple-500 transition-colors">
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
      </div>
    </div>
  );
};

export default ForumPosts;