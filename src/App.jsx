import "./App.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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


// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt"); // Check for JWT token
  return token ? children : <Navigate to="/" replace />;
};



// AdminRoute Component
const AdminRoute = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("userData")); // Retrieve stored user data
  const isAdmin = userData?.isAdmin;

  return  isAdmin ? children : <Navigate to="/" replace />;
};


const AppContent = () => {
  return (
    <Routes>
       {/* Admin Routes */}
      <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />     
      <Route path="/blog-post" element={<AdminRoute><BlogPost /></AdminRoute>} />
      {/* Public Routes */}         
      <Route
        path="*"
        element={
          <Layout className="w-full">
            <Routes>
              <Route path="/" element={<KeywordData />} />
              <Route path="/related-keywords" element={<PrivateRoute><KeywordResearch /></PrivateRoute>} />
              <Route path="/long-tail-keywords" element={<PrivateRoute><LongTailKeyword /></PrivateRoute>} />             
              <Route path="/keyword-difficulty" element={<PrivateRoute><KeywordDifficulty /></PrivateRoute>} />              
              <Route path="/Keyword-spam-score" element={<PrivateRoute><SpamScore /></PrivateRoute>} />
              <Route path="/keyword-trend" element={<PrivateRoute><WhatsTrending /></PrivateRoute>} />
              <Route path ="/search-volume" element={<PrivateRoute><AudienceVolume /></PrivateRoute>} />
              <Route path="/CPC" element={<PrivateRoute><CPCPage /></PrivateRoute>} />
              <Route path="/ad-competition" element={<PrivateRoute><AdCompetition /></PrivateRoute>} />
              <Route path="/profile-edit" element={<PrivateRoute><ProfileEdit /></PrivateRoute>} />

             
              
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
      <AppContent />
    </Router>
  );
}

export default App;