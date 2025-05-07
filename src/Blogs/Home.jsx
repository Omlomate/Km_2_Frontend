import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import { Search } from "lucide-react";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const blogsPerPage = 6;

  // Fetch blogs on mount
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, {
          method: "GET"         
        });
        if (!response.ok) throw new Error("Failed to fetch blogs");
        const data = await response.json();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on search
    
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      setFilteredBlogs(blogs);
      return;
    }

    const filtered = blogs.filter(blog => {
      const titleMatch = blog.title?.toLowerCase().includes(trimmedQuery);
      const contentMatch = blog.content?.toLowerCase().includes(trimmedQuery);
      return titleMatch || contentMatch;
    });
    setFilteredBlogs(filtered);
  };

  // Handle search button click
  const handleSearchButtonClick = () => {
    handleSearch(searchQuery);
  };

  // Calculate pagination using filteredBlogs instead of blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = async (pageNumber) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="w-full py-10 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative h-[260px] sm:h-[360px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transform hover:scale-[1.01] transition-transform duration-300">
            <div
              className="absolute inset-0 bg-[url('/src/assets/bgimage.png')] bg-cover bg-center"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
              <div className="relative h-full flex flex-col justify-center items-center p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-wantedSans text-white font-bold tracking-tight text-center max-w-3xl px-2 drop-shadow-lg">
                  THE BLOG OF KEYWORD RAJA
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 mt-8 sm:mt-10">
          <div className="bg-white/70 backdrop-blur-md rounded-lg border border-gray-200 shadow-md flex items-center p-2 sm:p-3 transition-all hover:shadow-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchButtonClick()}
              placeholder="Search Keyword"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-transparent text-gray-900 placeholder-gray-400 outline-none text-sm sm:text-base"
              style={{ fontFamily: "wantedsans" }}
            />
            <button 
              onClick={handleSearchButtonClick}
              className="p-2 sm:p-2.5 bg-[#E5590F] hover:bg-[#d14e0c] text-white cursor-pointer rounded-lg transition-all"
            >
              <i className="fa-solid fa-magnifying-glass text-xl sm:text-2xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Latest Posts
          </h2>
          <div className="w-20 sm:w-28 h-1.5 sm:h-2 bg-[#E5590F] rounded-full"></div>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Please try refreshing the page.</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden border border-gray-100 h-full"
              >
                <div className="bg-gray-200 aspect-video" />
                <div className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-full" />
                  <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-1/2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-gray-600 text-center p-10 bg-gray-50 rounded-xl border border-gray-100">
            <i className="fa-solid fa-search text-4xl text-gray-300 mb-4"></i>
            <p className="text-lg font-medium">
              {searchQuery 
                ? `No posted blogs found matching "${searchQuery}"`
                : "No blogs have been posted yet."}
            </p>
            {searchQuery && (
              <button 
                onClick={() => handleSearch('')}
                className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {currentBlogs.map((blog, index) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                index={indexOfFirstBlog + index}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredBlogs.length > 0 && (
          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all ${
                currentPage === 1 || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#12153d] text-white hover:bg-[#1a1f4d] shadow-md hover:shadow-lg"
              }`}
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Previous
            </button>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  disabled={isLoading}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-medium transition-all ${
                    currentPage === index + 1
                      ? "bg-[#E5590F] text-white shadow-md"
                      : isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#12153d] border border-gray-200 hover:border-[#E5590F] hover:text-[#E5590F] shadow-sm hover:shadow"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className={`w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium transition-all ${
                currentPage === totalPages || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#12153d] text-white hover:bg-[#1a1f4d] shadow-md hover:shadow-lg"
              }`}
            >
              Next <i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;