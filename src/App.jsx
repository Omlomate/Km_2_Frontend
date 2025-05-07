import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar/navbar.jsx";
import KeywordData from "./Components/ShowData/keywordData.jsx";
import Layout from "./Components/Layout.jsx";
import KeywordResearch from "./pages/relatedKeyword.jsx";
import LongTailKeyword from "./pages/LongTailKeyword.jsx";
import KeywordDifficulty from "./pages/keywordDifficulty.jsx";
import SpamScore from "./pages/SpamScore.jsx";
import WhatsTrending from "./pages/WhatsTrending.jsx";
import AudienceVolume from "./pages/AudienceVolume.jsx";
import CPCPage from "./pages/CPCPage.jsx";
import AdCompetition from "./pages/AdCompetition.jsx";
import ProfileEdit from "./Components/Profile/ProfileEdit.jsx";
import AdminDashboard from "./adminPages/AdminDashboard.jsx";
import BlogPost from "./adminPages/BlogPostPage.jsx";
import EditBlogPage from "./adminPages/EditBlogPage.jsx";
import Home from "./Blogs/Home.jsx";
import Show from "./Blogs/Show.jsx";
import { useState, useEffect } from "react";
import { initialBlogs } from "./assets/blogData.js";
import ControlMetaTags from "./adminPages/ControlMetaTags.jsx";
import Forum from "./Forum/Forum.jsx";
import { forumPosts } from "./Forum/ForumData.js";
import CreateForum from "./Forum/CreateForum.jsx";
import ShowForum from "./Forum/ShowForum.jsx";
import EditPost from "./Forum/EditPost.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "./Components/Footer/Footer.jsx";
import ForumPosts from "./adminPages/ForumPosts.jsx";
import ContactForm from "./Components/ContactForm/ContactForm.jsx";
import Courses from "./Components/Courses/Courses.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt"); // Check for JWT token
  return token ? children : <Navigate to="/" replace />;
};

// AdminRoute Component
const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData")); // Retrieve stored user data
  const isAdmin = userData?.isAdmin;
  return isAdmin ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
  // Forum
  const [posts, setPosts] = useState(forumPosts);
  const addPost = (newPost) => {
    const postWithId = {
      ...newPost,
      id: posts.length + 1,
      votes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts([...posts, postWithId]);
  };
  const addComment = (postId, comment) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, comment],
          };
        }
        return post;
      })
    );
  };

  // Blogs
  const [blogs, setBlogs] = useState(initialBlogs);
  const addBlog = (blog) => {
    setBlogs([...blogs, blog]);
  };

  // Load admin toggle settings from localStorage
  const [toggleSettings, setToggleSettings] = useState({
    navOptions: {},
    sidePanelOptions: {},
  });

  useEffect(() => {
    try {
      const adminSettings = JSON.parse(localStorage.getItem("adminToggleSettings")) || {};
      setToggleSettings({
        navOptions: adminSettings.navOptions || {},
        sidePanelOptions: adminSettings.sidePanelOptions || {},
      });
    } catch (error) {
      console.error("Error parsing adminToggleSettings from localStorage:", error);
      setToggleSettings({ navOptions: {}, sidePanelOptions: {} });
    }
  }, []);

  // Define routes with their toggle keys
  const privateRoutes = [
    {
      path: "/related-keywords",
      element: <KeywordResearch />,
      toggleKey: "relatedKeywords",
      toggleType: "navOptions",
    },
    {
      path: "/long-tail-keywords",
      element: <LongTailKeyword />,
      toggleKey: "longTailKeywords",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/keyword-difficulty",
      element: <KeywordDifficulty />,
      toggleKey: "keywordDifficulty",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/Keyword-spam-score",
      element: <SpamScore />,
      toggleKey: "spamScore",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/keyword-trend",
      element: <WhatsTrending />,
      toggleKey: "whatsTrending",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/search-volume",
      element: <AudienceVolume />,
      toggleKey: "audienceVolume",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/CPC",
      element: <CPCPage />,
      toggleKey: "cpc",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/ad-competition",
      element: <AdCompetition />,
      toggleKey: "adCompetition",
      toggleType: "navOptions",
      requiresAuth: true,
    },
    {
      path: "/profile-edit",
      element: <ProfileEdit />,
      toggleKey: "profileEdit",
      toggleType: "sidePanelOptions",
      requiresAuth: true,
    },
  ];

  return (
    <Routes>
      <Route path="/courses" element={<Courses/>} />
      <Route path="/contactForm" element={<ContactForm />} />
      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/blog-post"
        element={
          <AdminRoute>
            <BlogPost />
          </AdminRoute>
        }
      />
      <Route
        path="/edit-blog/:slug"
        element={
          <AdminRoute>
            <EditBlogPage />
          </AdminRoute>
        }
      />
      <Route
        path="/control-meta-tags"
        element={
          <AdminRoute>
            <ControlMetaTags />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/forum-posts"
        element={
          <AdminRoute>
            <ForumPosts />
          </AdminRoute>
        }
      />
      {/* Forum Routes */}
      <Route path="/forum" element={<Forum posts={posts} />} />
      <Route path="/create" element={<CreateForum onAddPost={addPost} />} />
      <Route
        path="/forum/:id"
        element={<ShowForum posts={posts} onAddComment={addComment} />}
      />
      <Route
        path="/forum/edit/:id"
        element={
          <AdminRoute>
            <EditPost />
          </AdminRoute>
        }
      />
      {/* Blogs */}
      <Route path="/blog" element={<Home blogs={blogs} />} />
      <Route path="/blog/:slug" element={<Show />} />

      {/* Public and Private Routes */}
      <Route
        path="*"
        element={
          <Layout className="w-full">
            <Routes>
              <Route path="/" element={<KeywordResearch />} />
              {privateRoutes.map(({ path, element, toggleKey, toggleType, requiresAuth }) => {
                const isEnabled = toggleSettings[toggleType][toggleKey] !== false; // Enabled unless explicitly false
                return (
                  <Route
                    key={path}
                    path={path}
                    element={
                      isEnabled ? (
                        requiresAuth ? (
                          <PrivateRoute>{element}</PrivateRoute>
                        ) : (
                          element
                        )
                      ) : (
                        <Navigate to="/" replace />
                      )
                    }
                  />
                );
              })}
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router basename="/">
        <Navbar />
        <div className="pt-28 md:pt-16">
          <AppContent />
        </div>
        <div className="md:px-6">
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;