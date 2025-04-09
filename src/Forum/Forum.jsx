import React from "react";
import { Link } from "react-router-dom";
import ForumPosts from "./ForumPost.jsx";
import ForumOption from "./ForumOption.jsx";

const Forum = ({ posts }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header section with search and create button */}
      <div className="max-w-7xl mx-auto px-4 mt-6   flex items-center gap-4">
        <div className="bg-white rounded-lg border border-gray-200 flex items-center p-2 flex-1 shadow-sm">
          <input
            type="text"
            placeholder="Search Topic"
            className="w-full px-4 py-2 bg-transparent text-gray-900 placeholder-gray-500 outline-none text-base"
            style={{ fontFamily: "wantedsans" }}
          />
          <button
            className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-all"
            aria-label="Search"
          >
            <i className="fa-solid fa-magnifying-glass text-xl text-gray-700 hover:text-[#E5590F]"></i>
          </button>
        </div>
        <Link
          to="/create"
          className="bg-[#12153D] text-white font-medium py-3 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Create Post</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6   flex items-center gap-2">
        <div className="flex flex-col md:flex-row gap-2">
          {/* Left Sidebar with Options */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <Link to="/profile-edit" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#12153D] rounded-full flex items-center justify-center text-white">
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="font-medium">Edit Profile</span>
              </Link>
{/*               
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Sort:</span>
                  <div className="relative">
                    <select className="appearance-none bg-transparent pr-8 py-1 outline-none text-sm">
                      <option>Newest</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                    </div>
                  </div>
                </div>
              </div> */}
              
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">All Time:</span>
                  <div className="relative">
                    <select className="appearance-none bg-transparent px-4 pr-8 py-1 outline-none text-sm">
                      <option className="px-4">All Time</option>
                      <option>Today</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center text-gray-500 font-medium">
                  AD
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area with Posts */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Latest Posts</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative">
                    <select className="appearance-none bg-transparent pr-8 py-1 outline-none text-sm">
                      <option>Newest</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {posts && posts.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {posts.map((post) => (
                  <div key={post.id}>
                    {/* <Link
                      to={`/forum/${post.id}`}
                      className="block"
                      aria-label={`View post: ${post.title}`}
                    >
                     
                    </Link> */}
                     <ForumPosts post={post} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <div className="mb-4 text-gray-400">
                  <i className="fa-solid fa-comments text-5xl"></i>
                </div>
                <p className="text-gray-500 mb-4">
                  No posts available. Create a post to get started!
                </p>
                <Link
                  to="/create"
                  className="inline-block bg-[#12153D] hover:bg-[#1a1f4d] text-white font-medium py-2 px-6 rounded-md transition-colors duration-300"
                >
                  Create Your First Post
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar for Ads (visible on larger screens) */}
          <div className="hidden lg:block w-64 flex-shrink-0 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-medium mb-3">Popular Topics</h3>
              <div className="space-y-2">
                <div className="bg-gray-100 p-2 rounded text-sm">#SEO</div>
                <div className="bg-gray-100 p-2 rounded text-sm">#ContentMarketing</div>
                <div className="bg-gray-100 p-2 rounded text-sm">#KeywordResearch</div>
              </div>
            </div>
            <div className="bg-[#12153D] h-80 rounded-lg flex items-center justify-center text-white font-medium">
              ADVERTISEMENT
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
