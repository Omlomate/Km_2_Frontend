// adminPages/EditBlogPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploadCloud, Loader2 } from "lucide-react";
import slugify from "slugify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EditBlogPage = () => {
  const { slug } = useParams(); // Get slug from URL
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [newSlug, setNewSlug] = useState(""); // Renamed to avoid confusion with fetched slug
  const [topic, setTopic] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [tags, setTags] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [publishedBy, setPublishedBy] = useState("");
  const [publisherLinkedIn, setPublisherLinkedIn] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quill configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
  ];

  // Fetch blog data on mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(
          `https://www.keywordraja.com/api/blogs/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch blog");
        const blogData = await response.json();
        setTitle(blogData.title);
        setMetaTitle(blogData.metaTitle || "");
        setNewSlug(blogData.slug);
        setTopic(blogData.topic);
        setShortDescription(blogData.shortDescription);
        setMetaDescription(blogData.metaDescription || "");
        setContent(blogData.content);
        setImageUrl(blogData.images.original || "");
        setImageAlt(blogData.imageAlt || "");
        setTags(blogData.tags?.join(", ") || "");
        setMetaKeywords(blogData.metaKeywords?.join(", ") || "");
        setPublishedBy(blogData.publishedBy);
        setPublisherLinkedIn(blogData.publisherLinkedIn || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setNewSlug(slugify(newTitle, { lower: true, strict: true }));
  };

  const handleImageFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl("");
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!title || !newSlug || !topic || !shortDescription || !content || !publishedBy) {
      setError("All required fields must be filled.");
      setSuccess(null);
      setIsSubmitting(false);
      return;
    }

    if (!imageFile && !imageUrl) {
      setError("Please provide either an image file or an image URL.");
      setSuccess(null);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("metaTitle", metaTitle);
    formData.append("slug", newSlug);
    formData.append("topic", topic);
    formData.append("shortDescription", shortDescription);
    formData.append("metaDescription", metaDescription);
    formData.append("content", content);
    if (imageFile) formData.append("image", imageFile);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (imageAlt) formData.append("imageAlt", imageAlt);
    formData.append(
      "tags",
      tags ? JSON.stringify(tags.split(",").map((tag) => tag.trim())) : "[]"
    );
    formData.append(
      "metaKeywords",
      metaKeywords
        ? JSON.stringify(metaKeywords.split(",").map((kw) => kw.trim()))
        : "[]"
    );
    formData.append("publishedBy", publishedBy);
    formData.append("publisherLinkedIn", publisherLinkedIn);

    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No authentication token found. Please log in.");

      const response = await fetch(
        `https://www.keywordraja.com/api/admin/blogs/${slug}`,
        {
          method: "PUT", // Use PUT for updates
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update blog");

      setSuccess("Blog updated successfully!");
      setError(null);
      setTimeout(() => navigate("/admin-dashboard"), 2000); // Redirect after success
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error && !success) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Blog Post
      </h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-500 text-center mb-4">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            placeholder="Blog Title *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Meta Title (max 60 chars, optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value.slice(0, 60))}
          />
          <p className="text-sm text-gray-500 mt-1">
            {metaTitle.length}/60 characters
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Slug *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={newSlug}
            onChange={(e) =>
              setNewSlug(slugify(e.target.value, { lower: true, strict: true }))
            }
            required
          />
          <p className="text-sm text-gray-500 mt-1">URL: /blog/{newSlug}</p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Topic *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Short Description (max 160 chars) *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value.slice(0, 160))}
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            {shortDescription.length}/160 characters
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Meta Description (max 160 chars, optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value.slice(0, 160))}
          />
          <p className="text-sm text-gray-500 mt-1">
            {metaDescription.length}/160 characters
          </p>
        </div>
        <div>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Content *"
            className="h-40"
            required
          />
        </div>
        <div className="pt-12">
          <label className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <UploadCloud className="text-blue-500 mr-2" />
            <span className="text-gray-600">
              {imageFile ? imageFile.name : "Upload a New Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileUpload}
            />
          </label>
          {(imageFile || imageUrl) && (
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
              alt="Preview"
              className="mt-2 max-w-xs rounded-lg"
            />
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Or paste an Image URL (e.g., from Google)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={imageUrl}
            onChange={handleImageUrlChange}
          />
          <p className="text-sm text-gray-500 mt-1">
            Upload a file or paste a URL. If both are provided, the uploaded file takes priority.
          </p>
        </div>
        <div>
          <input
            type="text"
            placeholder="Image Alt Text (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Tags (comma-separated, e.g., seo, blogging)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Meta Keywords (comma-separated, e.g., seo, web development)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Published By *"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={publishedBy}
            onChange={(e) => setPublishedBy(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Publisher LinkedIn (optional)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={publisherLinkedIn}
            onChange={(e) => setPublisherLinkedIn(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Blog"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditBlogPage;