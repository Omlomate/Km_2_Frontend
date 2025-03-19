import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import BlogCard from "./BlogCard";

const Show = ({ blogs }) => {
  const { id } = useParams();
  const blog = blogs[id];

  // Updated to show 4 related blogs
  const [relatedBlogs] = useState(
    blogs.filter((_, index) => index !== parseInt(id)).slice(0, 4)
  );

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <section id="Show-blogs">
      {" "}
      <div className="min-h-screen bg-gray-50">
        {/* Hero/Title Section */}
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative h-[200px] sm:h-[240px] md:h-[340px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
              <div
                className="absolute inset-0 bg-[url('/src/assets/bgimage.png')] bg-cover bg-center"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                <div className="relative h-full flex flex-col justify-center items-center p-3 sm:p-4 md:p-8">
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-wantedSans text-white font-bold tracking-tight text-center max-w-[90%] sm:max-w-3xl">
                    {blog.title}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Author Info */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-gray-600 text-xs sm:text-sm">
              published by - <span className="font-medium">xyz</span>
            </p>
          </div>

          {/* Blog Content */}
          <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-sm">
              <div className="text-gray-700 leading-relaxed space-y-4 sm:space-y-6">
                {blog.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </article>

          {/* More Blogs */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 px-2">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
              {relatedBlogs.map((relatedBlog, index) => (
                <BlogCard
                  key={index}
                  blog={relatedBlog}
                  index={blogs.indexOf(relatedBlog)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Show;
