import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const baseUrl = "http://localhost:5000"; // Use env variable in production
  const thumbnailUrl = blog.images.thumbnail.startsWith("http")
    ? blog.images.thumbnail // External URL, use as-is
    : `${baseUrl}${blog.images.thumbnail}`; // Local path, prepend base URL

  

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="block hover:opacity-90 transition-opacity"
    >
      <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnailUrl}
            alt={blog.imageAlt || blog.title}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold line-clamp-2">{blog.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {blog.shortDescription || "Short description of the blog here"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
