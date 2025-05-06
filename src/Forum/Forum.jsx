import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ForumPosts from "./ForumPost.jsx";
import axios from "axios";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  // Check localStorage for isAdmin on component mount
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        setIsAdmin(parsedData.isAdmin === true);
      } catch (e) {
        console.error("Error parsing userData from localStorage:", e);
      }
    }
  }, []);

  const handleReact = async (postId, reactionType) => {
    try {
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            const newReactions = { ...post.reactions };
            let newUserReaction = reactionType;
            if (reactionType) {
              newReactions[reactionType] =
                (newReactions[reactionType] || 0) + 1;
            }
            if (post.userReaction && post.userReaction !== reactionType) {
              newReactions[post.userReaction] = Math.max(
                0,
                (newReactions[post.userReaction] || 0) - 1
              );
            }
            if (!reactionType && post.userReaction) {
              newReactions[post.userReaction] = Math.max(
                0,
                (newReactions[post.userReaction] || 0) - 1
              );
              newUserReaction = null;
            }
            return {
              ...post,
              reactions: newReactions,
              userReaction: newUserReaction,
              userReacted: !!newUserReaction,
            };
          }
          return post;
        })
      );

      const token = localStorage.getItem("jwt");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/${postId}/react`,
        { reactionType },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
    } catch (error) {
      console.error("Error reacting to post:", error);
      setPosts(
        posts.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              reactions: post.reactions,
              userReaction: post.userReaction,
              userReacted: !!post.userReaction,
            };
          }
          return post;
        })
      );
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/forum/posts`,
          {
            params: { search, time: timeFilter, sort },
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            cache: "no-store",
          }
        );

        if (Array.isArray(response.data)) {
          const userId = token
            ? JSON.parse(atob(token.split(".")[1])).id
            : null;
          const postsWithUserReactions = response.data.map((post) => {
            const userReaction =
              userId &&
              post.userReactions?.find((r) => r.userId.toString() === userId);
            return {
              ...post,
              userReacted: !!userReaction,
              userReaction: userReaction?.reactionType || null,
            };
          });
          setPosts(postsWithUserReactions);
          setError(null);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        if (error.response?.status === 401) {
          setError("Please log in to view posts.");
        } else {
          setError("Failed to load posts. Please try again later.");
        }
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [search, timeFilter, sort]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const toggleMobileFilter = () => {
    setMobileFilterVisible(!mobileFilterVisible);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-10">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-[#12153D] to-[#1a1f4d] text-white py-8 px-4 mb-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-center"
            style={{ fontFamily: "wantedsans" }}
          >
            Forums
          </h1>
          <div className="mx-auto mt-2 w-16 h-1 bg-[#E5590F] rounded"></div>
          <p className="text-center mt-3 text-gray-200 max-w-2xl mx-auto">
            Join the conversation, share your insights, and connect with our
            community
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 flex items-center p-2 w-full shadow-sm">
            <input
              type="text"
              placeholder="Search Topic"
              value={search}
              onChange={handleSearch}
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
            className="group bg-[#12153D] text-white font-medium py-3 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto hover:bg-[#1a1f4d] transition-colors"
          >
            <svg
              className="stroke-[#E5590F] fill-none transition-transform duration-300 group-hover:rotate-90 group-hover:fill-[#12153d]/10 group-active:stroke-[#E5590f]/20 group-active:fill-[#E5590f]/50 group-active:duration-0"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeWidth="1.5"
                d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              ></path>
              <path strokeWidth="1.5" d="M8 12H16"></path>
              <path strokeWidth="1.5" d="M12 16V8"></path>
            </svg>
            <span>Create Post</span>
          </Link>
        </div>

        {/* Mobile filter toggle button */}
        <button
          className="lg:hidden w-full bg-white rounded-lg shadow-sm p-3 mb-4 flex items-center justify-between font-medium text-gray-700"
          onClick={toggleMobileFilter}
        >
          <span>Filters & Options</span>
          <i
            className={`fa-solid fa-chevron-${
              mobileFilterVisible ? "up" : "down"
            } text-gray-500`}
          ></i>
        </button>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar - hidden on mobile by default unless toggled */}
          <div
            className={`${
              mobileFilterVisible ? "block" : "hidden"
            } lg:block w-full lg:w-64 flex-shrink-0 order-2 lg:order-1 transition-all duration-300`}
          >
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <Link
                to="/profile-edit"
                className="flex items-center gap-3 mb-6 hover:text-[#E5590F] transition-colors"
              >
                <div className="w-10 h-10 bg-[#12153D] rounded-full flex items-center justify-center text-white">
                  <i className="fa-solid fa-user"></i>
                </div>
                <span className="font-medium">Edit Profile</span>
              </Link>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">
                    Time Filter:
                  </span>
                  <div className="relative">
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="appearance-none bg-transparent px-4 pr-8 py-1 outline-none text-sm border border-gray-200 rounded"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="mt-8 text-center  ">
              <div className="bg-gray-200   w-[250px] h-[250px] rounded-lg flex items-center justify-center text-gray-500 font-medium">
                AD
              </div>
            </div>
          </div>

          <div className="container mx-auto flex-1 order-1 lg:order-2 min-w-0">
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h2 className="text-xl font-bold text-[#12153D]">
                  Latest Posts
                </h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative flex-grow sm:flex-grow-0">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                      className="appearance-none bg-transparent pr-8 py-1 outline-none text-sm px-3 w-full border border-gray-200 rounded"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="popular">Most Popular</option>
                      <option value="discussed">Most Discussed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                      <i className="fa-solid fa-chevron-down text-xs text-gray-500"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((index) => (
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
            ) : error ? (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm w-full">
                <p className="text-red-500">{error}</p>
                {error.includes("log in") && (
                  <Link
                    to="/login"
                    className="inline-block mt-4 bg-[#12153D] hover:bg-[#1a1f4d] text-white font-medium py-2 px-6 rounded-md transition-colors"
                  >
                    Log In
                  </Link>
                )}
              </div>
            ) : posts.length > 0 ? (
              <div className="flex flex-col space-y-4">
                {posts.map((post, index) => {
                  if (!post._id) {
                    console.warn(`Post at index ${index} missing _id:`, post);
                    return null;
                  }
                  return (
                    <div
                      key={post._id}
                      className="transform hover:scale-[1.01] transition-transform"
                    >
                      <Link
                        to={`/forum/${post._id}`}
                        className="block"
                        aria-label={`View post: ${post.title || "Untitled"}`}
                      >
                        <ForumPosts
                          post={post}
                          onReact={handleReact}
                          isAdmin={isAdmin} // Pass isAdmin to ForumPosts
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm w-full">
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

          {/* Mobile advertisement - visible only on small screens (bottom) */}
          <div className="lg:hidden w-full order-4 mt-6">
            <div className="bg-gray-200 w-full h-[250px] rounded-lg flex items-center justify-center text-gray-500 font-medium">
              ADVERTISEMENT
            </div>
          </div>

          <div className="hidden lg:block w-64 flex-shrink-0 order-3">
            <div className="bg-white p-4 rounded-lg shadow-sm   top-4">
              <h3 className="font-medium mb-3 text-[#12153D]">
                Popular Topics
              </h3>
              <div className="space-y-2">
                <Link
                  to="/"
                  className="bg-gray-100 p-2 rounded text-sm block hover:bg-gray-200 transition"
                >
                  <span className="w-2 h-2 bg-[#E5590F] rounded-full"></span>
                  #SEO
                </Link>
                <Link
                  to="/"
                  className="bg-gray-100 p-2 rounded text-sm block hover:bg-gray-200 transition"
                >
                  <span className="w-2 h-2 bg-[#E5590F] rounded-full"></span>
                  #ContentMarketing
                </Link>
                <Link
                  to="/"
                  className="bg-gray-100 p-2 rounded text-sm block hover:bg-gray-200 transition"
                >
                  <span className="w-2 h-2 bg-[#E5590F] rounded-full"></span>
                  #KeywordResearch
                </Link>
              </div>
            </div>
            <div className="bg-gray-200 w-[250px] h-[250px] rounded-lg flex items-center justify-center text-gray-500 font-medium mt-4">
              AD
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
