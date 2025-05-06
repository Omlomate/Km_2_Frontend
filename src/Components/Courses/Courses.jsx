import React, { useState } from "react";
import { Link } from "react-router-dom";

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 3; // Number of courses per page

  const courseData = [
    {
      id: 1,
      title: "SEO Fundamentals",
      description:
        "Learn the basics of search engine optimization and improve your website ranking.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      duration: "4 weeks",
      level: "Beginner",
      category: "Digital Marketing",
    },
    {
      id: 2,
      title: "Content Marketing Mastery",
      description:
        "Create compelling content that drives traffic and converts visitors into customers.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      duration: "6 weeks",
      level: "Intermediate",
      category: "Digital Marketing",
    },
    {
      id: 3,
      title: "Keyword Research Pro",
      description:
        "Discover profitable keywords and analyze competition to dominate search results.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      duration: "3 weeks",
      level: "Intermediate",
      category: "SEO",
    },
    {
      id: 4,
      title: "Google Analytics for Beginners",
      description:
        "Understand website traffic and user behavior to make data-driven decisions.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      duration: "2 weeks",
      level: "Beginner",
      category: "Analytics",
    },
    {
      id: 5,
      title: "Advanced SEO Techniques",
      description:
        "Take your SEO skills to the next level with advanced strategies and tactics.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      duration: "8 weeks",
      level: "Advanced",
      category: "SEO",
    },
    {
      id: 6,
      title: "Social Media Marketing",
      description:
        "Build your brand presence and engage with customers across social platforms.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
      duration: "5 weeks",
      level: "Beginner",
      category: "Social Media",
    },
  ];

  const categories = [
    "All",
    "SEO",
    "Digital Marketing",
    "Analytics",
    "Social Media",
  ];

  // Filter courses based on selected category
  const filteredCourses =
    selectedCategory === "All"
      ? courseData
      : courseData.filter((course) => course.category === selectedCategory);

  // Calculate courses for the current page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#12153D] mb-4 font-wantedsans tracking-tight">
          Expand Your Digital Marketing Skills
        </h1>
        <div className="flex justify-center items-center mb-6">
          <div className="h-1 w-24 bg-[#E5590F] rounded-full"></div>
        </div>
        <p className="max-w-2xl mx-auto text-xl text-gray-600">
          Browse our selection of expert-led courses designed to help you master
          SEO and digital marketing.
        </p>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1); // Reset to the first page when category changes
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#E5590F] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            >
              {/* Course Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`${course.image}?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80`}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-0 right-0 bg-[#E5590F] text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                  {course.level}
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {course.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#12153D] mb-2 hover:text-[#E5590F] transition-colors duration-300">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-4 flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="flex items-center text-sm text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {course.duration}
                  </span>

                  <Link
                    to={`/courses/${course.id}`}
                    className="text-sm font-medium text-[#12153D] hover:text-[#E5590F] transition-colors duration-300"
                  >
                    View Details
                    <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              {/* Course Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <button className="w-full py-2 bg-[#12153D] text-white font-medium rounded-lg hover:bg-[#12153D]/90 transition duration-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#E5590F] text-white hover:bg-[#E5590F]/90"
          }`}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-[#E5590F] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`px-4 py-2 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#E5590F] text-white hover:bg-[#E5590F]/90"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Courses;