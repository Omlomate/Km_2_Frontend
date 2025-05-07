import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import BlogCard from "./BlogCard";

const Show = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  const baseUrl = `${import.meta.env.VITE_BACKEND_URL}`; // Replace with env variable in production

  // Check if user is admin on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const adminStatus = userData?.isAdmin || false;
    setIsAdmin(adminStatus);
  }, []);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const blogResponse = await fetch(`${baseUrl}/api/blogs/${slug}`, {
          method: "GET",
        });
        if (!blogResponse.ok) throw new Error("Failed to fetch blog");
        const blogData = await blogResponse.json();
        setBlog(blogData);

        const blogsResponse = await fetch(`${baseUrl}/api/blogs`, {
          method: "GET",
        });
        if (!blogsResponse.ok) throw new Error("Failed to fetch related blogs");
        const allBlogs = await blogsResponse.json();

        const related = allBlogs.filter((b) => b.slug !== slug).slice(0, 4);
        setRelatedBlogs(related);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="py-6 mb-4">
              {/* Skeleton title */}
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            </div>
            {/* Skeleton short description */}
            <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="row flex justify-between items-center mb-6">
            {/* Skeleton author info */}
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
            {/* Skeleton share buttons */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          {/* Skeleton hero image */}
          <div className="w-full aspect-[2/1] bg-gray-200 mb-6 rounded-lg"></div>
          <hr className="text-gray-400" />
          {/* Skeleton article content */}
          <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mt-4">
            <div className="bg-white rounded-lg p-4">
              <div className="space-y-4 sm:space-y-6">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </article>

          {/* Skeleton related articles */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4 sm:mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center py-10">Blog not found</div>;
  }

  const isAbsoluteUrl = (url) => /^(https?:\/\/)/i.test(url);
  const heroUrl = blog.images.hero
    ? isAbsoluteUrl(blog.images.hero)
      ? blog.images.hero
      : `${baseUrl}${blog.images.hero}`
    : "https://via.placeholder.com/1600x900?text=No+Image";
  const blogUrl = `${import.meta.env.VITE_BACKEND_URL}/blog/${slug}`;

  // Format the publish date
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section id="Show-blogs" className="mt-4">
      <Helmet>{/* Helmet content remains unchanged */}</Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="py-8 mb-4">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-start leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {blog.title}
              </h1>
            </div>
            <div className="bg-[#E5590f]/5 rounded-lg p-4 border-l-4 border-[#E5590f] shadow-sm">
              <p className="text-gray-700 text-lg font-medium italic">
                {blog.shortDescription || "Short description of the blog here"}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="bg-white rounded-lg shadow-sm p-3 flex items-center space-x-2 w-full sm:w-auto">
              <div className="w-10 h-10 bg-[#12153d]/20 rounded-full flex items-center justify-center text-[#12153d]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Published by{" "}
                  <span className="font-semibold text-[#E5590f]">
                    {blog.publishedBy || "xyz"}
                  </span>{" "}
                  <span className="text-gray-500">on {formattedDate}</span>
                  {blog.publisherLinkedIn && (
                    <span>
                      {" | "}
                      <a
                        href={blog.publisherLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#12153d] hover:underline inline-flex items-center"
                      >
                        LinkedIn
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to={`/edit-blog/${slug}`}
                  className="px-4 py-2 bg-[#12153d] text-white rounded-lg hover:bg-[#12153d]/80 transition-colors font-semibold flex items-center space-x-1 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Edit Blog</span>
                </Link>
              )}

              <div className="flex items-center gap-4">
                {/* Instagram Share Button */}
                {/* <div className="social-button">
                  <a
                    href={`https://www.instagram.com/?url=${encodeURIComponent(
                      blogUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-full group block"
                    aria-label="Share on Instagram"
                  >
                    <div className="floater w-full h-full absolute top-0 left-0 bg-violet-400 rounded-full duration-300 group-hover:-top-8 group-hover:shadow-2xl" />
                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-violet-400 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={22}
                        height={22}
                        viewBox="0 0 22 22"
                        fill="none"
                      >
                        <path
                          className="group-hover:fill-[#171543] fill-white duration-300"
                          d="M21.94 6.46809C21.8884 5.2991 21.6994 4.49551 21.4285 3.79911C21.1492 3.05994 20.7194 2.39818 20.1564 1.84802C19.6062 1.28932 18.9401 0.855163 18.2094 0.580194C17.5091 0.309437 16.7096 0.120336 15.5407 0.0688497C14.363 0.0128932 13.9891 0 11.0022 0C8.01527 0 7.64141 0.0128932 6.46808 0.064466C5.29914 0.116039 4.49551 0.305225 3.79932 0.57581C3.05994 0.855163 2.39818 1.28494 1.84802 1.84802C1.28932 2.39813 0.855377 3.06428 0.580193 3.7949C0.309437 4.49551 0.120379 5.2948 0.0688496 6.4637C0.0129362 7.64141 0 8.01527 0 11.0022C0 13.9891 0.0129362 14.363 0.0644659 15.5363C0.116039 16.7053 0.305225 17.5089 0.576025 18.2053C0.855377 18.9444 1.28932 19.6062 1.84802 20.1564C2.39818 20.7151 3.06432 21.1492 3.79494 21.4242C4.49547 21.6949 5.29476 21.884 6.46391 21.9355C7.63702 21.9873 8.0111 22 10.998 22C13.9849 22 14.3588 21.9873 15.5321 21.9355C16.7011 21.884 17.5047 21.695 18.2009 21.4242C18.9321 21.1415 19.5961 20.7091 20.1505 20.1548C20.7048 19.6005 21.1373 18.9365 21.42 18.2053C21.6906 17.5047 21.8798 16.7052 21.9314 15.5363C21.9829 14.363 21.9958 13.9891 21.9958 11.0022C21.9958 8.01527 21.9914 7.64137 21.94 6.46809ZM19.9588 15.4503C19.9114 16.5248 19.731 17.105 19.5805 17.4918C19.2109 18.4502 18.4502 19.2109 17.4918 19.5805C17.105 19.731 16.5206 19.9114 15.4503 19.9586C14.29 20.0103 13.942 20.023 11.0066 20.023C8.07118 20.023 7.71881 20.0103 6.56259 19.9586C5.48816 19.9114 4.90796 19.731 4.52117 19.5805C4.04425 19.4043 3.61014 19.1249 3.25772 18.7596C2.89242 18.4029 2.61306 17.9731 2.43677 17.4961C2.28635 17.1094 2.10589 16.5248 2.05874 15.4547C2.007 14.2943 1.99428 13.9461 1.99428 11.0107C1.99428 8.07535 2.007 7.72298 2.05874 6.56698C2.10589 5.49254 2.28635 4.91235 2.43677 4.52555C2.61306 4.04842 2.89241 3.61439 3.26211 3.26189C3.61865 2.89658 4.04842 2.61723 4.52555 2.44115C4.91235 2.29073 5.49692 2.11023 6.56697 2.06291C7.72736 2.01134 8.07556 1.99844 11.0107 1.99844C13.9505 1.99844 14.2985 2.01134 15.4547 2.06291C16.5292 2.11027 17.1093 2.29069 17.4961 2.44111C17.9731 2.61723 18.4072 2.89658 18.7596 3.26189C19.1249 3.61865 19.4042 4.04842 19.5805 4.52555C19.731 4.91235 19.9114 5.49671 19.9587 6.56698C20.0103 7.72736 20.0232 8.07535 20.0232 11.0107C20.0232 13.9461 20.0104 14.29 19.9588 15.4503Z"
                        />
                        <path
                          className="group-hover:fill-[#171543] fill-white duration-300"
                          d="M11.0026 5.35054C7.88252 5.35054 5.35107 7.88182 5.35107 11.0021C5.35107 14.1223 7.88252 16.6536 11.0026 16.6536C14.1227 16.6536 16.6541 14.1223 16.6541 11.0021C16.6541 7.88182 14.1227 5.35054 11.0026 5.35054ZM11.0026 14.668C8.97844 14.668 7.33654 13.0264 7.33654 11.0021C7.33654 8.97774 8.97844 7.33609 11.0025 7.33609C13.0269 7.33609 14.6685 8.97774 14.6685 11.0021C14.6685 13.0264 13.0268 14.668 11.0026 14.668ZM18.1971 5.12706C18.1971 5.85569 17.6063 6.44646 16.8775 6.44646C16.1489 6.44646 15.5581 5.85569 15.5581 5.12706C15.5581 4.39833 16.1489 3.80774 16.8775 3.80774C17.6063 3.80774 18.1971 4.39829 18.1971 5.12706Z"
                        />
                      </svg>
                    </div>
                  </a>
                </div> */}

                {/* GitHub Share Button */}
                {/* <div className="social-button">
                  <a
                    href={`https://github.com/login?return_to=${encodeURIComponent(
                      blogUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-full group block"
                    aria-label="Share on GitHub"
                  >
                    <div className="floater w-full h-full absolute top-0 left-0 bg-black rounded-full duration-300 group-hover:-top-8 group-hover:shadow-2xl" />
                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-black rounded-full">
                      <svg
                        height={24}
                        width={24}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="group-hover:fill-[#171543] fill-white duration-300"
                          d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.17 6.839 9.481.5.092.683-.217.683-.481 0-.237-.009-.866-.013-1.699-2.782.603-3.37-1.338-3.37-1.338-.454-1.15-1.11-1.458-1.11-1.458-.906-.619.069-.606.069-.606 1.002.071 1.527 1.03 1.527 1.03.89 1.529 2.34 1.087 2.911.831.091-.645.348-1.087.634-1.338-2.22-.252-4.555-1.11-4.555-4.94 0-1.09.39-1.986 1.028-2.682-.103-.252-.446-1.268.098-2.642 0 0 .837-.268 2.75 1.024a9.563 9.563 0 012.496-.335 9.58 9.58 0 012.496.335c1.913-1.292 2.75-1.024 2.75-1.024.544 1.374.202 2.39.1 2.642.64.696 1.027 1.592 1.027 2.682 0 3.839-2.338 4.685-4.567 4.933.358.309.678.916.678 1.847 0 1.334-.012 2.412-.012 2.74 0 .267.18.577.688.481A12.01 12.01 0 0022 12c0-5.523-4.477-10-10-10z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    </div>
                  </a>
                </div> */}

                {/* LinkedIn Share Button */}
                <div className="social-button">
                  <a
                    href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                      blogUrl
                    )}&title=${encodeURIComponent(
                      blog.metaTitle || blog.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-full group block"
                    aria-label="Share on LinkedIn"
                  >
                    <div className="floater w-full h-full absolute top-0 left-0 bg-blue-500 rounded-full duration-300 group-hover:-top-8 group-hover:shadow-2xl" />
                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-blue-500 rounded-full">
                      <svg
                        height={24}
                        width={24}
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="group-hover:fill-[#171543] fill-white duration-300"
                          d="M20,2H4C2.9,2,2,2.9,2,4v16c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2z M8.5,19H6V10h2.5V19z M7.3,9 h-0.1C6.4,9,6,8.6,6,8.1V7.9c0-0.5,0.4-0.9,0.9-0.9h0.1C7.6,7,8,7.4,8,7.9v0.1C8,8.6,7.6,9,7.3,9z M19,19h-2.5v-4.9 c0-1.2-0.4-2-1.4-2c-0.8,0-1.3,0.6-1.5,1.2h-0.1V19H10V10h2.3v1.3h0C12.7,10.7,14,9.9,15.5,9.9c2.1,0,3.5,1.4,3.5,3.8V19z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    </div>
                  </a>
                </div>

                {/* Twitter/X Share Button */}
                <div className="social-button">
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                      blogUrl
                    )}&text=${encodeURIComponent(
                      blog.metaTitle || blog.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-full group block"
                    aria-label="Share on X"
                  >
                    <div className="floater w-full h-full absolute top-0 left-0 bg-gray-800 rounded-full duration-300 group-hover:-top-8 group-hover:shadow-2xl" />
                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-gray-800 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path
                          className="group-hover:fill-[#171543] fill-white duration-300"
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                        />
                      </svg>
                    </div>
                  </a>
                </div>

                {/* Facebook Share Button */}
                <div className="social-button">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      blogUrl
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative w-12 h-12 rounded-full group block"
                    aria-label="Share on Facebook"
                  >
                    <div className="floater w-full h-full absolute top-0 left-0 bg-blue-600 rounded-full duration-300 group-hover:-top-8 group-hover:shadow-2xl" />
                    <div className="icon relative z-10 w-full h-full flex items-center justify-center border-2 border-blue-600 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="text-white"
                      >
                        <path
                          className="group-hover:fill-[#171543] fill-white duration-300"
                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full aspect-[2/1] relative mb-8 rounded-xl overflow-hidden shadow-md">
            <img
              src={heroUrl}
              alt={blog.imageAlt || blog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <hr className="border-gray-200 mb-6" />
          <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mt-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div
                className="text-gray-700 leading-relaxed space-y-4 sm:space-y-6"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </article>

          <div className="mt-12 sm:mt-16 md:mt-20">
            <div className="flex items-center mb-6 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                More Articles
              </h2>
              <div className="ml-4 flex-grow h-0.5 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Show;
