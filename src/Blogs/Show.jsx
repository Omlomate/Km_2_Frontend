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

  const baseUrl = "http://localhost:5000"; // Replace with env variable in production

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

        const related = allBlogs
          .filter((b) => b.slug !== slug)
          .slice(0, 4);
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
    ? (isAbsoluteUrl(blog.images.hero)
        ? blog.images.hero
        : `${baseUrl}${blog.images.hero}`)
    : "https://via.placeholder.com/1600x900?text=No+Image";
  const blogUrl = `http://localhost:5173/blog/${slug}`;

  return (
    <section id="Show-blogs">
      <Helmet>
        <title>{blog.metaTitle || blog.title} | Keyword Rajas</title>
        <meta name="description" content={blog.metaDescription || blog.shortDescription} />
        <meta name="keywords" content={blog.metaKeywords?.join(", ") || blog.tags?.join(", ") || "blog, SEO, keywords"} />
        <meta name="author" content={blog.author?.name || "xyz"} />
        <link rel="canonical" href={blogUrl} />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.shortDescription} />
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
              name: "Keyword Rajas",
              logo: { "@type": "ImageObject", url: "http://localhost:5173/logo.png" },
            },
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="relative h-[200px] sm:h-[240px] md:h-[340px] rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
              <img
                src={heroUrl}
                alt={blog.imageAlt || blog.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="relative h-full flex flex-col justify-center items-center p-3 sm:p-4 md:p-8">
                <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-wantedSans text-white font-bold tracking-tight text-center max-w-[90%] sm:max-w-3xl">
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-gray-600 text-xs sm:text-sm">
              Published by - <span className="font-medium">{blog.author?.name || "xyz"}</span>
            </p>
          </div>

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

          <div className="mt-6 flex justify-center gap-4">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(blog.metaTitle || blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Share on X
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?url=${encodeURIComponent(blogUrl)}&title=${encodeURIComponent(blog.metaTitle || blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:underline"
            >
              Share on LinkedIn
            </a>
          </div>

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