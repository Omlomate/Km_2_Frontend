import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`; // Use env variable in production
  const thumbnailUrl = blog.images.thumbnail.startsWith("http")
    ? blog.images.thumbnail // External URL, use as-is
    : `${baseUrl}${blog.images.thumbnail}`; // Local path, prepend base URL

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="block group h-full"
    >
      <div className="flex flex-col w-full h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-gray-200 transform group-hover:translate-y-[-4px]">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={blog.imageAlt || blog.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {blog.category && (
            <span className="absolute top-3 right-3 bg-[#E5590F]/90 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {blog.category}
            </span>
          )}
        </div>
        <div className="p-5 space-y-3 flex-grow">
          <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-[#E5590F] transition-colors">{blog.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {blog.shortDescription || "Short description of the blog here"}
          </p>
          <div className="pt-3 flex items-center text-xs text-gray-500">
            <span className="flex items-center">
              <i className="fa-regular fa-calendar mr-1"></i>
              {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span className="mx-2">•</span>
            <span className="flex items-center">
              <i className="fa-regular fa-clock mr-1"></i>
              {blog.readTime || "5 min read"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
