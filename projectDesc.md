# Project Pages Description

 ├── .env                    # Environment variables configuration
├── .gitignore              # Git ignore file
├── README.md               # Project documentation
├── eslint.config.js        # ESLint configuration
├── index.html              # Entry HTML file
├── package.json            # NPM package configuration
├── package-lock.json       # NPM package lock
├── public/                 # Public assets
│   └── fonts/              # Custom fonts
│       └── WantedSans.ttf  # WantedSans font file
├── src/                    # Source code
│   ├── App.css             # Main application styles
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global CSS styles
│   ├── main.jsx            # Application entry point
│   ├── Blogs/              # Blog-related components
│   │   ├── BlogCard.jsx    # Blog card component
│   │   ├── Home.jsx        # Blog home page
│   │   └── Show.jsx        # Blog post display
│   ├── Components/         # Reusable components
│   │   ├── ContactForm/    # Contact form components
│   │   ├── Courses/        # Course-related components
│   │   ├── Footer/         # Footer components
│   │   ├── Layout.jsx      # Main layout component
│   │   ├── Loading/        # Loading indicators
│   │   ├── Login&Registation/ # Authentication components
│   │   ├── Navbar/         # Navigation components
│   │   ├── Profile/        # User profile components
│   │   ├── ShowData/       # Data display components
│   │   ├── SidePanel/      # Side panel components
│   │   ├── TextEditor/     # Rich text editor components
│   │   └── ui/             # UI utility components
│   ├── Forum/              # Forum functionality
│   │   ├── CreateForum.jsx # Forum creation
│   │   ├── EditPost.jsx    # Post editing
│   │   ├── Forum.jsx       # Main forum component
│   │   ├── ForumData.js    # Forum data handling
│   │   ├── ForumOption.jsx # Forum options
│   │   ├── ForumPost.jsx   # Forum post component
│   │   ├── ShowForum.jsx   # Forum display
│   │   └── UserForum.jsx   # User-specific forums
│   ├── adminPages/         # Admin dashboard pages
│   │   ├── AdminDashboard.jsx # Main admin dashboard
│   │   ├── BlogPostPage.jsx   # Blog post management
│   │   ├── ControlMetaTags.jsx # SEO meta tags control
│   │   ├── EditBlogPage.jsx    # Blog editing
│   │   └── ForumPosts.jsx      # Forum post management
│   ├── assets/             # Static assets
│   │   ├── Various SVG files   # Icons and graphics
│   │   ├── bgimage.png         # Background image
│   │   └── Various data files  # Static data
│   ├── hooks/              # Custom React hooks
│   │   └── useKeywordData.js # Hook for keyword data
│   ├── pages/              # Main application pages
│   │   ├── AdCompetition.jsx    # Ad competition analysis
│   │   ├── AudienceVolume.jsx   # Audience volume metrics
│   │   ├── CPCPage.jsx          # Cost Per Click analysis
│   │   ├── LongTailKeyword.jsx  # Long tail keyword tools
│   │   ├── SpamScore.jsx        # Spam score analysis
│   │   ├── WhatsTrending.jsx    # Trending topics
│   │   ├── keywordDifficulty.jsx # Keyword difficulty analysis
│   │   └── relatedKeyword.jsx   # Related keyword tools
│   └── utils/              # Utility functions
│       └── auth.js         # Authentication utilities
├── vercel.json            # Vercel deployment configuration
└── vite.config.js         # Vite configuration

---

## Overview
This document provides a detailed description of each page and key component within the project, organized by their respective directories and functionalities. The project appears to be a React-based web application with features for blogging, forums, admin management, and SEO/marketing tools.

## Blogs
- **Home.jsx**: The main blog page, serving as the entry point for blog content. It displays a list or grid of blog posts, allowing users to browse available articles.
- **BlogCard.jsx**: A reusable component that represents an individual blog post preview. It typically includes the post’s title, a short excerpt, a thumbnail image, and a link to the full post.
- **Show.jsx**: A page dedicated to displaying the full content of a single blog post. It includes the post’s body, author details, publication date, comments section, and related metadata.

## Components
- **Layout.jsx**: The main layout component that wraps all pages, ensuring a consistent structure across the application. It typically includes the header, footer, navigation bar, and main content area.
- **ContactForm/**: A directory containing components for rendering and managing a contact form. It allows users to send messages or inquiries, with fields for name, email, and message.
- **Courses/**: A directory with components related to course content, such as course listings, detailed course pages, or enrollment forms for educational offerings.
- **Footer/**: Components for the website’s footer, including links to important pages (e.g., About, Contact), contact information, social media icons, and branding elements.
- **Loading/**: Components for displaying loading indicators, such as spinners or progress bars, shown during data fetching or page transitions to improve user experience.
- **Login&Registation/**: Components for user authentication, including login forms, registration forms, password recovery, and possibly two-factor authentication interfaces.
- **Navbar/**: Components for the navigation bar, providing links to key sections like Home, Blogs, Forum, and user profile, with responsive design for mobile and desktop.
- **Profile/**: Components for displaying and editing user profile information, such as username, bio, profile picture, and account settings.
- **ShowData/**: Components for rendering dynamic data, such as tables, charts, or lists, used in various parts of the application to present information clearly.
- **SidePanel/**: Components for a side panel or sidebar, often used for secondary navigation, filters, or additional controls, especially in admin or forum sections.
- **TextEditor/**: Components for a rich text editor, enabling users to create or edit formatted content, such as blog posts or forum replies, with features like bold, italic, and links.
- **ui/**: A directory of utility UI components, such as buttons, modals, tooltips, or dropdowns, used throughout the application for consistent styling and functionality.

## Forum
- **Forum.jsx**: The main forum page, displaying a list of forum threads or categories, allowing users to browse discussions or access specific topics.
- **CreateForum.jsx**: A page or component for creating new forum threads or topics, with fields for title, content, and optional tags or categories.
- **EditPost.jsx**: A component for editing existing forum posts, enabling users to update content, fix typos, or modify metadata like tags.
- **ForumData.js**: A utility file for handling forum-related data, such as fetching threads, posts, or user information, and formatting it for display.
- **ForumOption.jsx**: A component for forum-specific options, such as sorting threads (e.g., by date or popularity), filtering posts, or moderation tools like pinning or locking.
- **ForumPost.jsx**: A component for rendering individual forum posts, including the post content, author name, timestamp, and options like reply or like.
- **ShowForum.jsx**: A page for displaying a single forum thread, showing the original post, all replies, and a form to add new replies.
- **UserForum.jsx**: A page or component for user-specific forum content, such as threads they created, posts they participated in, or followed discussions.

## adminPages
- **AdminDashboard.jsx**: The main dashboard for administrators, providing an overview of site metrics (e.g., user growth, post activity), quick access to management tools, and alerts for moderation tasks.
- **BlogPostPage.jsx**: A page for managing blog posts, allowing admins to create new posts, edit existing ones, delete posts, or manage drafts.
- **ControlMetaTags.jsx**: A page or component for managing SEO meta tags, such as page titles, descriptions, and keywords, to optimize search engine visibility.
- **EditBlogPage.jsx**: A page specifically for editing existing blog posts, with a rich text editor, fields for metadata (e.g., tags, categories), and options to publish or save as a draft.
- **ForumPosts.jsx**: A page for managing forum posts, enabling admins to moderate content, edit or remove inappropriate posts, and manage reported content.

## pages
- **AdCompetition.jsx**: A page for analyzing ad competition, displaying metrics like competitor ad strategies, ad spend estimates, or market share, useful for marketing teams.
- **AudienceVolume.jsx**: A page for analyzing audience volume metrics, such as user demographics, traffic sources, or engagement trends, to understand the user base.
- **CPCPage.jsx**: A page for Cost Per Click (CPC) analysis, providing insights into advertising costs, campaign performance, and optimization opportunities.
- **LongTailKeyword.jsx**: A page with tools for identifying and analyzing long-tail keywords, helping users target niche search terms for SEO or paid ads.
- **SpamScore.jsx**: A page for analyzing spam scores, assessing the quality or trustworthiness of content, links, or domains to avoid penalties or improve SEO.
- **WhatsTrending.jsx**: A page showcasing trending topics or keywords, useful for content creators or marketers to plan timely content or campaigns.
- **keywordDifficulty.jsx**: A page for analyzing keyword difficulty, helping users evaluate how challenging it is to rank for specific keywords in search engines.
- **relatedKeyword.jsx**: A page with tools for discovering related keywords, aiding in SEO, content optimization, or expanding keyword strategies.