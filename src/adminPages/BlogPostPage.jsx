import { useState } from "react";
import { UploadCloud } from "lucide-react";

const BlogPost = () => {
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Blog Submitted:", { title, topic, shortDescription, content, image });
    // TODO: Send this data to your backend API
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 border border-gray-200">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create a Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Topic"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          type="text"
          placeholder="Short Description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
        />
        <textarea
          placeholder="Content"
          className="w-full p-3 border border-gray-300 rounded-lg h-40 focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <label className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
          <UploadCloud className="text-blue-500 mr-2" />
          <span className="text-gray-600">Upload an Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
        {image && <p className="text-sm text-green-600">{image.name} selected</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Publish Blog
        </button>
      </form>
    </div>
  );
};

export default BlogPost;
