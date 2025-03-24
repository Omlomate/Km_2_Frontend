import { useState } from "react";
// import { UploadCloud } from "lucide-react";
import { UploadCloud, Loader2 } from "lucide-react"; // Import Loader2 icon
import slugify from "slugify";

const BlogPost = () => {
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState(""); // New field for SEO title
  const [slug, setSlug] = useState("");
  const [topic, setTopic] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [metaDescription, setMetaDescription] = useState(""); // New field for SEO description
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null); // For uploaded image file
  const [imageUrl, setImageUrl] = useState(""); // For external image URL
  const [imageAlt, setImageAlt] = useState("");
  const [tags, setTags] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add loading state

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle, { lower: true, strict: true }));
  };

  const handleImageFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Clear URL if file is uploaded
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setImageFile(null); // Clear file if URL is provided
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!title || !slug || !topic || !shortDescription || !content) {
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

    // Prepare form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("metaTitle", metaTitle); // Add metaTitle
    formData.append("slug", slug);
    formData.append("topic", topic);
    formData.append("shortDescription", shortDescription);
    formData.append("metaDescription", metaDescription); // Add metaDescription
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

    try {
      const token = localStorage.getItem("jwt"); // Adjust based on where you store the token
      if (!token)
        throw new Error("No authentication token found. Please log in.");

      const response = await fetch(
        "https://keyword-research3.onrender.com/api/blogs",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`, // Send JWT token
          },
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to publish blog");

      setSuccess("Blog published successfully!");
      setError(null);
      // Reset form
      setTitle("");
      setMetaTitle("");
      setSlug("");
      setTopic("");
      setShortDescription("");
      setMetaDescription("");
      setContent("");
      setImageFile(null);
      setImageUrl("");
      setImageAlt("");
      setTags("");
      setMetaKeywords("");
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create a Blog Post
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
            value={slug}
            onChange={(e) =>
              setSlug(slugify(e.target.value, { lower: true, strict: true }))
            }
            required
          />
          <p className="text-sm text-gray-500 mt-1">URL: /blog/{slug}</p>
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
          <textarea
            placeholder="Content *"
            className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
            <UploadCloud className="text-blue-500 mr-2" />
            <span className="text-gray-600">
              {imageFile ? imageFile.name : "Upload an Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileUpload}
            />
          </label>
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
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
          {imageUrl && (
            <img
              src={imageUrl}
              alt="URL Preview"
              className="mt-2 max-w-xs rounded-lg"
              onError={() => setError("Invalid image URL")}
            />
          )}
          <p className="text-sm text-gray-500 mt-1">
            Upload a file or paste a URL. If both are provided, the uploaded
            file takes priority.
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
              Publishing...
            </>
          ) : (
            "Publish Blog"
          )}
        </button>
      </form>
    </div>
  );
};

export default BlogPost;
