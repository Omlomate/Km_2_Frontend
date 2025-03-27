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
import Home from "./Blogs/Home.jsx";
import Show from "./Blogs/Show.jsx";
import { useState } from "react";
import { initialBlogs } from "./assets/blogData.js";

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
  // blogs
  const [blogs, setBlogs] = useState(initialBlogs);

  const addBlog = (blog) => {
    setBlogs([...blogs, blog]);
  };
  return (
    <Routes>
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
      {/* Blogs */}
      <Route path="/blog" element={<Home blogs={blogs} />} />
      <Route path="/blog/:slug" element={<Show />} />

      {/* Public Routes */}
      <Route
        path="*"
        element={
          <Layout className="w-full">
            <Routes>
              <Route path="/" element={<KeywordData />} />
              <Route
                path="/related-keywords"
                element={
                  <PrivateRoute>
                    <KeywordResearch />
                  </PrivateRoute>
                }
              />
              <Route
                path="/long-tail-keywords"
                element={
                  <PrivateRoute>
                    <LongTailKeyword />
                  </PrivateRoute>
                }
              />
              <Route
                path="/keyword-difficulty"
                element={
                  <PrivateRoute>
                    <KeywordDifficulty />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Keyword-spam-score"
                element={
                  <PrivateRoute>
                    <SpamScore />
                  </PrivateRoute>
                }
              />
              <Route
                path="/keyword-trend"
                element={
                  <PrivateRoute>
                    <WhatsTrending />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search-volume"
                element={
                  <PrivateRoute>
                    <AudienceVolume />
                  </PrivateRoute>
                }
              />
              <Route
                path="/CPC"
                element={
                  <PrivateRoute>
                    <CPCPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ad-competition"
                element={
                  <PrivateRoute>
                    <AdCompetition />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile-edit"
                element={
                  <PrivateRoute>
                    <ProfileEdit />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <Router basename="/">
      <Navbar />
      <div className="pt-28 md:pt-16">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
