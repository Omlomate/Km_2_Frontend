import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextEditor from "../Components/TextEditor/TextEditor.jsx";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateForum = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState("text");
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "text" && !content) {
      toast.error("Please add content to your post");
      return;
    }

    if (activeTab === "images/video" && !image) {
      toast.error("Please upload an image or video");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title || "Untitled Post");
      formData.append("content", content);
      formData.append("contentType", activeTab === "text" ? "html" : "image");

      // Get userData from localStorage and set author as user._id and username
      const userData = JSON.parse(localStorage.getItem("userData")) || {};     
      console.log(userData);
      if (!userData._id) {
        throw new Error("User ID not found in localStorage");
      }
      if (!userData.firstName) {
        throw new Error("Username not found in localStorage");
      }
      formData.append("author", userData._id);
      formData.append("username", `${userData.firstName} ${userData.lastName}`);

      if (image) {
        const file = dataURLtoFile(image, "upload.jpg");
        formData.append("image", file);
      }

      const token = localStorage.getItem("jwt");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forum/posts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setTitle("");
      setContent("");
      setImage(null);
      navigate("/forum");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(`Failed to create post: ${error.message || "Unknown error"}`);
    }finally {
      setIsLoading(false); // End loading regardless of outcome
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <section id="createForum">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Create a post</h1>
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              className={`pb-2 ${activeTab === "text" ? "border-b-2 border-orange-500 font-semibold text-gray-800" : "text-gray-500"}`}
              onClick={() => setActiveTab("text")}
            >
              text
            </button>
            <button
              className={`pb-2 ${activeTab === "images/video" ? "border-b-2 border-orange-500 font-semibold text-gray-800" : "text-gray-500"}`}
              onClick={() => setActiveTab("images/video")}
            >
              images/video
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none bg-white"
              placeholder="Add Title"
            />
          </div>
          {activeTab === "text" && (
            <div className="mb-6">
              <TextEditor value={content} onChange={setContent} placeholder="Add Body" />
            </div>
          )}
          {activeTab === "images/video" && (
            <div
              className="mb-6 border border-gray-300 bg-white h-[332px] flex items-center justify-center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {image ? (
                <div className="relative w-full h-full">
                  <img src={image} alt="Uploaded content" className="w-full h-full object-contain p-4" />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1"
                    onClick={() => setImage(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 text-center">
                  <p className="text-gray-500">Drag and drop or upload</p>
                  <label className="cursor-pointer">
                    <div className="bg-[#12153d] text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 36 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M26.3637 31.9259H9.7312C4.51197 31.9259 0.265625 27.5616 0.265625 22.1978C0.265625 17.8241 3.08546 14.0219 7.16229 12.8372C8.77769 8.07411 13.1114 4.89734 18.0473 4.89734C22.9832 4.89734 27.3168 8.07411 28.9326 12.8372C33.0098 14.0215 35.8293 17.8237 35.8293 22.1978C35.8293 27.5616 31.5833 31.9259 26.3637 31.9259ZM18.0477 6.10233C13.516 6.10233 9.54943 9.08294 8.17744 13.5187L8.07786 13.8404L7.75897 13.9212C4.03739 14.8642 1.43805 18.2676 1.43805 22.1974C1.43805 26.8971 5.15845 30.7205 9.7312 30.7205H26.3641C30.9373 30.7205 34.6573 26.8967 34.6573 22.1974C34.6573 18.2672 32.0583 14.8638 28.3363 13.9212L28.0178 13.8404L27.9183 13.5187C26.5459 9.08294 22.5789 6.10233 18.0477 6.10233ZM18.0477 27.8203C16.6804 27.8203 15.5684 26.6774 15.5684 25.2722V19.1331L15.1713 19.5409C14.7046 20.0205 14.0823 20.2849 13.4184 20.2849C12.7545 20.2849 12.1322 20.0205 11.6651 19.5409C10.6985 18.5475 10.6985 16.9306 11.6651 15.9372L16.2872 11.1822C16.616 10.8439 17.0274 10.6116 17.4826 10.5032L17.5553 10.4841C17.8884 10.4159 18.212 10.4171 18.5396 10.4841L18.61 10.5024C19.0668 10.6108 19.4785 10.8431 19.8029 11.1766L19.8484 11.2281L24.4302 15.9372C25.3968 16.9306 25.3968 18.5475 24.4302 19.5409C23.9635 20.0205 23.3412 20.2849 22.6769 20.2849C22.013 20.2849 21.3907 20.0205 20.924 19.5409L20.5273 19.1331V25.2722C20.5269 26.6774 19.4149 27.8203 18.0477 27.8203ZM16.7409 16.2236V25.2722C16.7409 26.0126 17.3273 26.6153 18.0477 26.6153C18.7684 26.6153 19.3544 26.0126 19.3544 25.2722V16.2236L21.7526 18.6892C22.2438 19.194 23.1104 19.1936 23.6008 18.6892C23.8462 18.437 23.9813 18.0995 23.9813 17.7393C23.9813 17.379 23.8462 17.0419 23.6008 16.7897L18.9498 12.0055C18.7854 11.8442 18.5716 11.7285 18.3341 11.6745L18.284 11.6611C18.1192 11.6306 17.971 11.6314 17.8121 11.6607L17.7588 11.6745C17.5241 11.7277 17.3119 11.8418 17.1439 12.0059L17.1103 12.0441L12.4941 16.7897C12.2487 17.0419 12.1136 17.3794 12.1136 17.7393C12.1136 18.0995 12.2487 18.437 12.4941 18.6892C13.0039 19.2123 13.8329 19.2123 14.3423 18.6892L16.7409 16.2236Z"
                          fill="#EBEBEB"
                        />
                      </svg>
                    </div>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              onClick={async () => {
                try {
                  const formData = new FormData();
                  formData.append("title", title || "Untitled Draft");
                  formData.append("content", content);
                  formData.append("contentType", activeTab === "text" ? "html" : "image");
                  const userData = JSON.parse(localStorage.getItem("userData")) || {};
                  if (!userData._id) {
                    throw new Error("User ID not found in localStorage");
                  }
                  if (!userData.username) {
                    throw new Error("Username not found in localStorage");
                  }
                  formData.append("author", userData._id);
                  formData.append("username", userData.username);
                  if (image) {
                    const file = dataURLtoFile(image, "upload.jpg");
                    formData.append("image", file);
                  }
                  const token = localStorage.getItem("jwt");
                  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forum/posts/draft`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  alert("Draft saved");
                } catch (error) {
                  console.error("Error saving draft:", error);
                  toast.error(`Failed to save draft: ${error.message || "Unknown error"}`);
                }
              }}
            >
              save draft
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  posting...
                </>
              ) : 'post'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateForum;