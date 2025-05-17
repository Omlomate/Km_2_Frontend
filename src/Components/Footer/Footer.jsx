import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import loginLogo from "../../assets/loginLogo.svg";
import logoText from "../../assets/LogoText.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState({});

  // Load social media links from localStorage on mount
  useEffect(() => {
    try {
      const adminSettings =
        JSON.parse(localStorage.getItem("adminToggleSettings")) || {};
      setSocialLinks(adminSettings.socials || {});
    } catch (error) {
      console.error(
        "Error parsing adminToggleSettings from localStorage:",
        error
      );
      setSocialLinks({});
    }
  }, []);

  // Define social media items with icons and fallback URLs
  const socialItems = [
    {
      name: "Facebook",
      key: "Facebook",
      url:
        socialLinks.Facebook ||
        "https://www.facebook.com/people/Keyword-Raja/61574543301396/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      key: "Instagram",
      url: socialLinks.Instagram || "https://www.instagram.com/keyword_raja/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      key: "YouTube",
      url: socialLinks.YouTube || "#",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      key: "LinkedIn",
      url:
        socialLinks.LinkedIn ||
        "https://www.linkedin.com/showcase/keywordraja/",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      ),
    },
    {
      name: "Email",
      key: "Email",
      url: socialLinks.Email || "mailto:support@keywordraja.com",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
    },
  ].filter((item) => item.url && item.url !== "#"); // Only include items with valid URLs

  return (
    <footer className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 py-12 md:py-16 border-t border-gray-200 md:mt-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Logo and Description */}
          <div className="w-full md:w-3/4 col-span-1 ">
            <div className="flex items-center flex-shrink-0 text-gray-700 mb-4">
              <a
                href="/related-keywords"
                className="flex items-center gap-2 logo-hover transition-transform duration-300"
              >
                {/* Logo mark SVG - smaller on mobile */}
                <img
                  src={loginLogo}
                  alt="Logo"
                  className="w-8 h-8 md:w-10 md:h-10 transition-all duration-300"
                />
                {/* Text logo SVG - responsive width */}
                <img
                  src={logoText}
                  alt="keywordRaja"
                  className="h-6 md:h-8 block transition-all duration-300"
                />
              </a>
            </div>

            <p className="text-gray-900 mb-3 font-bold text-base sm:text-md md:text-lg lg:text-xl text-start leading-tight sm:leading-tight">
              KeywordRaja – Free AI-Powered Keyword Research Tool
            </p>
            <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base text-justify leading-normal  ">
              We believe effective keyword research should be simple, smart, and
              accessible to all without the burden of high costs. Whether you're
              a content creator, small business owner, or affiliate marketer,
              KeywordRaja offers a powerful suite of AI-driven tools to help you
              uncover high-impact, low-competition keywords tailored to your
              niche.
            </p>
          </div>

          {/* Links Section */}
          <div className="w-full col-span-1">
            <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4">
              {/* Community */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Community</h3>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/forum"
                    className="text-sm hover:text-[#E5590F] transition-colors flex items-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z"
                        fill="currentColor"
                      />
                    </svg>
                    Forum
                  </Link>
                  <Link
                    to="/blog"
                    className="text-sm hover:text-[#E5590F] transition-colors flex items-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2zm0 4h2v2H7v-2z"
                        fill="currentColor"
                      />
                    </svg>
                    Blog
                  </Link>
                </div>
              </div>

              {/* Company */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Company</h3>
                <div className="flex flex-col gap-3">
                  <Link
                    to="/contactForm"
                    className="text-sm hover:text-[#E5590F] transition-colors flex items-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
                        fill="currentColor"
                      />
                    </svg>
                    Contact Us
                  </Link>
                  <Link
                    to=""
                    className="text-sm hover:text-[#E5590F] transition-colors flex items-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"
                        fill="currentColor"
                      />
                    </svg>
                    Careers
                  </Link>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold">Follow Us</h3>
                <div className="flex gap-3 flex-wrap">
                  {socialItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.url}
                      className="text-gray-500 hover:text-[#E5590F] transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md"
                      aria-label={item.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="flex flex-col justify-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-2 justify-center md:justify-center">
            <div className="flex flex-wrap gap-4 justify-center md:justify-center mb-4 md:mb-6">
              <Link
                to="/privacy&policy"
                className="text-gray-500 hover:text-[#E5590F] text-xs md:text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <div className="h-4 w-0.5 bg-gray-300 mx-1"></div>
              <a
                href="https://kolorowey.com/terms-of-use"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#E5590F] text-xs md:text-sm transition-colors"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-gray-500 text-xs md:text-sm text-center">
              <span className="text-[#12153d] text-lg">©</span> {currentYear}{" "}
              Kolorowey Media Private Limited. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
