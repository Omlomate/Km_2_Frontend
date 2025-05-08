import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

const ShowCourses = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sample course data - in a real app, you would fetch this from an API
  const courseData = [
    {
      id: 1,
      title: "SEO Fundamentals",
      description:
        "Learn the basics of search engine optimization and improve your website ranking.",
      fullDescription: "This comprehensive course covers all aspects of modern SEO practices. You'll learn how to optimize your website for search engines, understand keyword research, build quality backlinks, and track your SEO performance. By the end of this course, you'll have the skills to improve your website's visibility in search results and drive more organic traffic.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      duration: "4 weeks",
      level: "Beginner",
      category: "Digital Marketing",
      instructor: "Jane Smith",
      rating: 4.8,
      students: 1245,
      modules: [
        "Introduction to SEO",
        "Keyword Research",
        "On-Page Optimization",
        "Off-Page Optimization",
        "Technical SEO",
        "SEO Analytics"
      ]
    },
    {
      id: 2,
      title: "Content Marketing Mastery",
      description:
        "Create compelling content that drives traffic and converts visitors into customers.",
      fullDescription: "Master the art of content marketing with this in-depth course. Learn how to create engaging content that resonates with your target audience, develop a content strategy that aligns with your business goals, and measure the effectiveness of your content marketing efforts. This course includes practical exercises and real-world examples to help you implement content marketing strategies immediately.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
      duration: "6 weeks",
      level: "Intermediate",
      category: "Digital Marketing",
      instructor: "Michael Johnson",
      rating: 4.6,
      students: 987,
      modules: [
        "Content Marketing Fundamentals",
        "Audience Research",
        "Content Creation",
        "Content Distribution",
        "Content Analytics",
        "Content Optimization"
      ]
    },
    {
      id: 3,
      title: "Keyword Research Pro",
      description:
        "Discover profitable keywords and analyze competition to dominate search results.",
      fullDescription: "Take your keyword research skills to the next level with this professional course. Learn advanced techniques for finding high-value keywords with low competition, analyze your competitors' keyword strategies, and develop a comprehensive keyword plan for your website. This course includes access to professional SEO tools and hands-on workshops to apply what you learn.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      duration: "3 weeks",
      level: "Intermediate",
      category: "SEO",
      instructor: "David Wilson",
      rating: 4.9,
      students: 756,
      modules: [
        "Keyword Research Fundamentals",
        "Competitor Keyword Analysis",
        "Long-tail Keywords",
        "Keyword Difficulty Assessment",
        "Keyword Mapping",
        "Keyword Tracking"
      ],
      price: 39.99
    },
    {
      id: 4,
      title: "Google Analytics for Beginners",
      description:
        "Understand website traffic and user behavior to make data-driven decisions.",
      fullDescription: "Get started with Google Analytics in this beginner-friendly course. Learn how to set up Google Analytics for your website, understand key metrics and dimensions, create custom reports and dashboards, and use data to improve your website performance. By the end of this course, you'll be able to confidently navigate Google Analytics and extract valuable insights about your website visitors.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
      duration: "2 weeks",
      level: "Beginner",
      category: "Analytics",
      instructor: "Sarah Thompson",
      rating: 4.7,
      students: 1532,
      modules: [
        "Google Analytics Setup",
        "Understanding the Dashboard",
        "Audience Reports",
        "Acquisition Reports",
        "Behavior Reports",
        "Conversion Tracking"
      ],
      price: 29.99
    },
    {
      id: 5,
      title: "Advanced SEO Techniques",
      description:
        "Take your SEO skills to the next level with advanced strategies and tactics.",
      fullDescription: "This advanced course is designed for SEO professionals looking to master cutting-edge techniques. Dive deep into technical SEO audits, advanced link building strategies, international SEO, mobile optimization, and voice search optimization. You'll also learn how to handle complex SEO challenges and stay ahead of algorithm updates. This course includes case studies from successful SEO campaigns and expert interviews.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      duration: "8 weeks",
      level: "Advanced",
      category: "SEO",
      instructor: "Robert Chen",
      rating: 4.9,
      students: 645,
      modules: [
        "Technical SEO Auditing",
        "Advanced Link Building",
        "Schema Markup",
        "Mobile SEO",
        "Voice Search Optimization",
        "E-commerce SEO",
        "International SEO",
        "Algorithm Updates"
      ],
      price: 79.99
    },
    {
      id: 6,
      title: "Social Media Marketing",
      description:
        "Build your brand presence and engage with customers across social platforms.",
      fullDescription: "Master social media marketing across all major platforms in this comprehensive course. Learn how to create effective social media strategies, develop engaging content for different platforms, build and manage communities, run successful social media advertising campaigns, and measure your social media ROI. This course includes platform-specific tactics for Facebook, Instagram, Twitter, LinkedIn, and TikTok.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7",
      duration: "5 weeks",
      level: "Beginner",
      category: "Social Media",
      instructor: "Emily Rodriguez",
      rating: 4.8,
      students: 1876,
      modules: [
        "Social Media Strategy",
        "Content Creation",
        "Community Management",
        "Social Media Advertising",
        "Analytics and Reporting"
      ],
      price: 49.99
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundCourse = courseData.find(c => c.id === parseInt(id));
      setCourse(foundCourse);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#E5590F]"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <h2 className="text-2xl font-bold text-[#12153D] mb-4">Course Not Found</h2>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Link to="/courses" className="px-6 py-3 bg-[#E5590F] text-white rounded-lg hover:bg-[#E5590F]/90 transition-colors">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-[#E5590F] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <Link to="/courses" className="text-gray-600 hover:text-[#E5590F] transition-colors ml-1 md:ml-2">
                    Courses
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                  </svg>
                  <span className="text-gray-500 ml-1 md:ml-2">{course.title}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Course Header */}
        <div className="bg-white rounded-xl overflow-hidden shadow-md mb-8">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={`${course.image}?w=800&h=600&fit=crop&crop=entropy&auto=format&q=90`} 
                alt={course.title} 
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">{course.category}</span>
                  <span className="bg-[#E5590F]/10 text-[#E5590F] text-xs font-medium px-2.5 py-0.5 rounded">{course.level}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#12153D] mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.fullDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E5590F] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E5590F] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700">{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E5590F] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <span className="text-gray-700">{course.rating} (Rating)</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#E5590F] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-gray-700">{course.students} students</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-end mb-4">
                  <button className="px-6 py-3 bg-[#E5590F] text-white font-medium rounded-lg hover:bg-[#E5590F]/90 transition-colors flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-[#12153D] mb-4">Course Content</h2>
            <div className="space-y-3">
              {course.modules.map((module, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg flex items-center">
                  <div className="bg-[#12153D] text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <span className="text-gray-700">{module}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#12153D] mb-6">Related Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseData
              .filter(c => c.category === course.category && c.id !== course.id)
              .slice(0, 3)
              .map(relatedCourse => (
                <div key={relatedCourse.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={`${relatedCourse.image}?w=600&h=400&fit=crop&crop=entropy&auto=format&q=80`} 
                      alt={relatedCourse.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-0 right-0 bg-[#E5590F] text-white text-xs font-bold px-3 py-1 m-2 rounded-full">
                      {relatedCourse.level}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#12153D] mb-2 hover:text-[#E5590F] transition-colors">
                      <Link to={`/courses/${relatedCourse.id}`}>{relatedCourse.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedCourse.description}</p>
                    <div className="flex justify-end items-center">
                      <Link 
                        to={`/courses/${relatedCourse.id}`}
                        className="text-sm font-medium text-[#12153D] hover:text-[#E5590F] transition-colors"
                      >
                        View Details
                        <span className="ml-1">→</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCourses;
