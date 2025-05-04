import React, { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col mt-4 mb-4 md:flex-row items-center justify-between gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-6xl mx-auto">
      {/* Left side - SVG Illustration */}
      <div className="w-full md:w-2/5 relative mb-6 md:mb-0">
        <div className="relative p-2 sm:p-4">
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 relative transition-all duration-300 hover:shadow-md">
            <div className="w-full max-w-[200px] sm:max-w-[250px] mx-auto">
              <div className="relative">
                {/* SVG Logo */}
                <svg
                  className="w-full h-auto mx-auto transform transition-transform duration-500 hover:scale-105"
                  viewBox="0 0 360 398"
                >
                  <path
                    d="M54.9577 182.394L2.36267 391.782C1.56966 394.939 3.95687 398 7.21202 398H352.001C355.867 398 359.001 394.866 359.001 391V0L234.236 195.991L183.814 100.814L109.115 240.666L54.9577 182.394Z"
                    fill="#12153D"
                  />
                  <path
                    d="M1 199V398H347.2C353.827 398 359.2 392.627 359.2 386V199L259.7 290.54L180.1 199L100.5 290.54L1 199Z"
                    fill="#E5590F"
                  />
                </svg>

                {/* KeywordRaja text - moved below logo */}
                <div className="text-center mt-4 mb-2">
                  <h3 className="font-bold text-xl sm:text-2xl tracking-wider">
                    <span className="text-[#E5590F]">Keyword</span>
                    <span className="text-[#12153D]">Raja</span>
                  </h3>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-3 h-3 sm:w-4 sm:h-4 bg-[#E5590F] rounded-full animate-pulse"></div>
                <div className="absolute top-1/2 -right-4 w-3 h-3 sm:w-4 sm:h-4 bg-[#12153d] rounded-full animate-pulse"></div>
                <div className="absolute -bottom-2 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-[#12153d]   rounded-full animate-pulse"></div>
                <div className="absolute top-1/4 -left-6 sm:-left-8 w-4 h-4 sm:w-6 sm:h-6 border-2 border-[#E5590F] bg-transparent rounded-full"></div>
                <div className="absolute bottom-1/3 -right-6 sm:-right-8 w-4 h-4 sm:w-6 sm:h-6 border-2 border-[#12153d] bg-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-3/5">
        {/* Contact Info Section with improved styling */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg border-l-4 border-[#E5590F] shadow-sm">
          <h3 className="text-xl font-semibold mb-3 text-[#12153D] flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#E5590F]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            Contact Us
          </h3>

          <div className="space-y-2">
            <p className="text-gray-600 flex items-center hover:text-[#E5590F] transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#E5590F]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              contact@keywordraja.com
            </p>

            {/* Social Media Icons */}
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#12153D] flex items-center">
          <span className="mr-2">Get in touch</span>
          <div className="h-1 w-10 bg-[#E5590F] rounded-full ml-2"></div>
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="relative group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5590F] pl-10 transition-all duration-300 border border-transparent focus:border-[#E5590F]/30"
              required
            />
            <span className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#E5590F] transition-colors duration-300">
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
            </span>
          </div>

          <div className="relative group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5590F] pl-10 transition-all duration-300 border border-transparent focus:border-[#E5590F]/30"
              required
            />
            <span className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-[#E5590F] transition-colors duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </span>
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            rows="4"
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5590F] transition-all duration-300 border border-transparent focus:border-[#E5590F]/30 resize-y min-h-[120px]"
            required
          ></textarea>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 items-center justify-center">
            <button
              type="submit"
              className="w-full sm:w-1/2 py-3 bg-[#E5590F] text-white font-medium rounded-lg hover:bg-[#E5590F]/90 transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#E5590F] focus:ring-offset-2 transform hover:-translate-y-0.5 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
