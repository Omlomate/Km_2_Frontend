import { useState, useEffect } from "react";
import axios from "axios";

const ForumPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/forum/admin/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setLoading(false);
      setMessage({ type: "error", text: "Failed to load posts" });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCheck = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/admin/posts/${id}/check`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
      setMessage({ type: "success", text: "Post approved successfully" });
    } catch (error) {
      console.error("Error checking post:", error);
      setMessage({ type: "error", text: "Failed to approve post" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/forum/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
      setMessage({ type: "success", text: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      setMessage({
        type: "error",
        text: error.response?.status === 404 ? "Post not found" : "Failed to delete post",
      });
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Admin: Review Posts</h2>
      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {posts.length === 0 ? (
          <p>No unchecked posts found.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Content</th>
                <th className="border border-gray-300 p-2">Author</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="text-center">
                  <td className="border border-gray-300 p-2">{post.title}</td>
                  <td className="border border-gray-300 p-2">
                    {post.contentType === "html" ? (
                      <div
                        className="text-sm text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: post.content.substring(0, 100) + (post.content.length > 100 ? "..." : ""),
                        }}
                      />
                    ) : (
                      <span>{post.content.substring(0, 100) + (post.content.length > 100 ? "..." : "")}</span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">{post.username}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleCheck(post._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ForumPosts;