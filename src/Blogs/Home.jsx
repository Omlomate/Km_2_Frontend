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
        const response = await fetch("https://www.keywordraja.com/api/blogs", {
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
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog); // Fixed to use filteredBlogs
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage); // Fixed to use filteredBlogs

  const paginate = async (pageNumber) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="w-full py-8 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="relative h-[240px] sm:h-[340px] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 bg-[url('/src/assets/bgimage.png')] bg-cover bg-center"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="relative h-full flex flex-col justify-center items-center p-4 sm:p-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-wantedSans text-white font-bold tracking-tight text-center max-w-3xl px-2">
                  THE BLOG OF KEYWORD RAJA
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-6xl mx-auto px-4 mt-6 sm:mt-8">
          <div className="bg-white/50 backdrop-blur-md rounded-lg border-1 border-gray-500 flex items-center p-1.5 sm:p-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Only update query here
              placeholder="Search Keyword"
              className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-transparent text-gray-900 placeholder-gray-300 outline-none text-sm sm:text-base"
              style={{ fontFamily: "wantedsans" }}
            />
            <button 
              onClick={handleSearchButtonClick}
              className="p-1.5 sm:p-2 hover:bg-white/10 cursor-pointer rounded-full transition-all"
            >
              <i className="fa-solid fa-magnifying-glass text-xl sm:text-2xl text-gray-700 hover:text-[#E5590F]"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Latest Posts
          </h2>
          <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-[#E5590F] rounded-full"></div>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}. Please try refreshing the page.
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-white rounded-lg sm:rounded-2xl shadow-md sm:shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="bg-gray-200 aspect-video" />
                <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="h-4 sm:h-5 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-full" />
                  <div className="h-3 sm:h-4 bg-gray-200 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? ( // Changed to check filteredBlogs
          <p className="text-gray-600 text-center">
            {searchQuery 
              ? `No posted blogs found matching "${searchQuery}"`
              : "No blogs have been posted yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
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
        {filteredBlogs.length > 0 && ( // Changed to check filteredBlogs
          <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all ${
                currentPage === 1 || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#12153d] text-white hover:bg-[#1a1f4d] shadow-md"
              }`}
            >
              Previous
            </button>

            <div className="flex flex-wrap justify-center gap-2 sm:space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  disabled={isLoading}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-medium transition-all ${
                    currentPage === index + 1
                      ? "bg-[#E5590F] text-white shadow-md"
                      : isLoading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-[#12153d] border border-gray-200 hover:border-[#E5590F] hover:text-[#E5590F] shadow-sm"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className={`w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all ${
                currentPage === totalPages || isLoading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-[#12153d] text-white hover:bg-[#1a1f4d] shadow-md"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;