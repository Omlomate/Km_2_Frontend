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
    return <div className="text-center py-10">Loading...</div>;
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
      <Helmet>
        <title>{blog.metaTitle || blog.title} | Keyword Rajas</title>
        <meta
          name="description"
          content={blog.metaDescription || blog.shortDescription}
        />
        <meta
          name="keywords"
          content={
            blog.metaKeywords?.join(", ") ||
            blog.tags?.join(", ") ||
            "blog, SEO, keywords"
          }
        />
        <meta name="author" content={blog.author?.name || "xyz"} />
        <link rel="canonical" href={blogUrl} />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta
          property="og:description"
          content={blog.metaDescription || blog.shortDescription}
        />
        <meta property="og:image" content={heroUrl} />
        <meta property="og:url" content={blogUrl} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.metaTitle || blog.title,
            description: blog.metaDescription || blog.shortDescription,
            image: heroUrl,
            author: { "@type": "Person", name: blog.author?.name || "xyz" },
            datePublished: blog.createdAt,
            publisher: {
              "@type": "Organization",
              name: blog.publishedBy || "Keyword Rajas",
              url: blog.publisherLinkedIn || "https://www.keywordraja.com",
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="py-6 mb-4">
              <h1
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-start"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {blog.title}
              </h1>
            </div>
            <p className="text-gray-600 text-lg line-clamp-3 p-3 font-bold">
              {blog.shortDescription || "Short description of the blog here"}
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="row flex justify-between items-center mb-6">
            <div className="text-center">
              <p className="text-gray-600 text-xs sm:text-sm">
                Published by -{" "}
                <span className="font-medium">{blog.publishedBy || "xyz"}</span>{" "}
                on {formattedDate}
                {blog.publisherLinkedIn && (
                  <span>
                    {" | "}
                    <a
                      href={blog.publisherLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      LinkedIn
                    </a>
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  to={`/edit-blog/${slug}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Edit Blog
                </Link>
              )}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  blogUrl
                )}&text=${encodeURIComponent(blog.metaTitle || blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center"
                aria-label="Share on X"
              >
                <div className="text-blue-500 hover:text-blue-700 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium">
                  X
                </span>
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(
                  blogUrl
                )}&title=${encodeURIComponent(blog.metaTitle || blog.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center"
                aria-label="Share on LinkedIn"
              >
                <div className="text-blue-700 hover:text-blue-900 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <span className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-medium">
                  LinkedIn
                </span>
              </a>
            </div>
          </div>
          <div className="w-full aspect-[2/1] relative mb-6 rounded-lg overflow-hidden">
            <img
              src={heroUrl}
              alt={blog.imageAlt || blog.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <hr className="text-gray-400" />
          <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mt-4">
            <div className="bg-white rounded-lg">
              <div
                className="text-gray-700 leading-relaxed space-y-4 sm:space-y-6"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </article>

          <div className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-8 px-2">
              More Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
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