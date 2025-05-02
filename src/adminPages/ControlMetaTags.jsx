import { useState, useEffect } from "react";
import axios from "axios";

const ControlMetaTags = () => {
  const [metaTags, setMetaTags] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });

  // Fetch all meta tags from the backend
  const fetchMetaTags = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/meta`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    //   console.log("API Response:", data); // Debug: Check what the API returns
      // Ensure data is an array; if not, default to empty array
      setMetaTags(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching meta tags:", error);
      setMetaTags([]); // Fallback to empty array on error
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetaTags();
  }, []);

  // Handle edit button click
  const handleEdit = (metaTag) => {
    setEditMode(metaTag._id);
    setFormData({ title: metaTag.title, description: metaTag.description });
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save (update meta tag)
  const handleSave = async (id) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/meta/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditMode(null);
      fetchMetaTags(); // Refresh the list
    } catch (error) {
      console.error("Error updating meta tag:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Control Meta Tags
      </h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {metaTags.length === 0 ? (
          <p>No meta tags found.</p> // Display message if array is empty
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Page Slug</th>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Description</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {metaTags.map((metaTag) => (
                <tr key={metaTag._id} className="text-center">
                  <td className="border border-gray-300 p-2">
                    {metaTag.pageSlug}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editMode === metaTag._id ? (
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                        maxLength="60"
                      />
                    ) : (
                      metaTag.title
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editMode === metaTag._id ? (
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-1 border rounded"
                        maxLength="160"
                      />
                    ) : (
                      metaTag.description
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {editMode === metaTag._id ? (
                      <button
                        onClick={() => handleSave(metaTag._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(metaTag)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
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

export default ControlMetaTags;