import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog, index }) => {
  return (
    <Link to={`/blog/${index}`} className="block hover:opacity-90 transition-opacity">
      <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={blog.image} 
            alt={blog.title} 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-xl font-semibold line-clamp-2">{blog.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">
            {blog.shortDescription || 'Short description of the blog here'}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;