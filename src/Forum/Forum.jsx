import React from "react";
import { Link } from "react-router-dom";
import ForumPosts from "./ForumPost.jsx";

const Forum = ({ posts }) => {
  // Remove the duplicate posts state since we're receiving it as a prop

  return (
    <div>
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative h-[240px] sm:h-[340px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 bg-[url('/src/assets/bgimage.png')] bg-cover bg-center"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="relative h-full flex flex-col justify-center items-center p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-wantedSans text-white font-bold tracking-tight text-center max-w-3xl px-2">
                  ADS
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-6 sm:mt-8 sm:px-6 flex items-center gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-500 flex items-center p-2 flex-1 shadow-sm">
            <input
              type="text"
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)} // Only update query here
              placeholder="Search Topic"
              className="w-full px-4 py-2 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-base"
              style={{ fontFamily: "wantedsans" }}
            />
            <button 
              // onClick={handleSearchButtonClick}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-all"
            >
              <i className="fa-solid fa-magnifying-glass text-xl text-gray-700 hover:text-[#E5590F]"></i>
            </button>
          </div>
          <Link to="/create" className="bg-white hover:bg-gray-50 text-black font-medium py-4 px-8 rounded-lg transition-colors duration-300 shadow-sm border border-gray-500">
            create
          </Link>
        </div>
      </div>
      <div>
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest Post</h2>
            {/* <Link
              to="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Create Post
            </Link> */}
          </div>

          {posts && posts.length > 0 ? (
            <div className="flex flex-col space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="relative">
                  {/* <Link
                    to={`/forum/${post.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`View post: ${post.title}`}
                  /> */}
                  <ForumPosts post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-500 mb-4">
                No posts available. Create a post to get started!
              </p>
              <Link
                to="/create"
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
              >
                Create Your First Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;
