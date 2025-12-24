import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Courses from './pages/Courses/Courses'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Contact from './pages/Contact/Contact'
import CoursePage from './pages/CourseInfo/CourseInfo'
import ForgetPassword from './pages/forget-password/forget'
import ResetPassword from './pages/reset-password/reset'
import NotFound from './pages/NotFound/NotFound'
import NavBar from './components/NavBar/NavBar'
import Footer from './components/Footer/Footer'
import Services from './pages/Services/Services'
import 'sweetalert2/dist/sweetalert2.min.css';
import './styles/sweetalert.css';
import SearchResults from './pages/Search/SearchResults'
import GoogleCallback from './pages/GoogleCallback/GoogleCallback'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import { UserProvider } from './context/UserContext'
import LessonPage from './pages/LessonPage/LessonPage'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile/Profile'
// Admin Components
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminUsers from "./pages/Admin/Users/Users";
import AdminCourses from "./pages/Admin/Courses/Courses";
import AdminSubscriptions from "./pages/Admin/Subscriptions/Subscriptions";
import AdminReports from "./pages/Admin/Reports/Reports";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyCourses from "./pages/myCourses/MyCourses";
import Certificates from "./pages/Certificates/Certificates";

// Layout component to ensure navbar consistency
const Layout = ({ children, path }) => {
  return (
    <>
      <NavBar activePage={path} />
      {children}
      <Footer />
    </>
  );
};

// Wrapper component to access location in Layout
const LayoutWithPath = ({ children }) => {
  const location = useLocation();
  return <Layout path={location.pathname} children={children} />;
};

// Private Route component for admin routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/4b8c686f-b237-4ff5-a74e-1c2aac42233b', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'debug-session',
      runId: 'run1',
      hypothesisId: 'H4',
      location: 'App.jsx:AdminRoute',
      message: 'AdminRoute check',
      data: { isAuthenticated, isAdmin },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="">
          <Routes>
            <Route
              path="/"
              element={
                <LayoutWithPath>
                  <Home />
                </LayoutWithPath>
              }
            />
            <Route
              path="/about"
              element={
                <LayoutWithPath>
                  <About />
                </LayoutWithPath>
              }
            />
            <Route
              path="/services"
              element={
                <LayoutWithPath>
                  <Services />
                </LayoutWithPath>
              }
            />
            <Route
              path="/courses"
              element={
                <LayoutWithPath>
                  <Courses />
                </LayoutWithPath>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/CoursePage/:courseId"
              element={
                <LayoutWithPath>
                  <CoursePage />
                </LayoutWithPath>
              }
            />
            <Route path="/course/:courseId/lessons" element={<LessonPage />} />
            <Route
              path="/Contact"
              element={
                <LayoutWithPath>
                  <Contact />
                </LayoutWithPath>
              }
            />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/search-results"
              element={
                <LayoutWithPath>
                  <SearchResults />
                </LayoutWithPath>
              }
            />
            <Route
              path="/auth/google"
              element={
                <LayoutWithPath>
                  <GoogleCallback />
                </LayoutWithPath>
              }
            />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route
              path="/profile"
              element={
                <LayoutWithPath>
                  <Profile />
                </LayoutWithPath>
              }
            />
            <Route
              path="/mycourses"
              element={
                <LayoutWithPath>
                  <MyCourses />
                </LayoutWithPath>
              }
            />
            <Route
              path="/certificates"
              element={
                <LayoutWithPath>
                  <Certificates />
                </LayoutWithPath>
              }
            />
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <LayoutWithPath>
                    <AdminDashboard />
                  </LayoutWithPath>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <LayoutWithPath>
                    <AdminUsers />
                  </LayoutWithPath>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <LayoutWithPath>
                    <AdminCourses />
                  </LayoutWithPath>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/subscriptions"
              element={
                <AdminRoute>
                  <LayoutWithPath>
                    <AdminSubscriptions />
                  </LayoutWithPath>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminRoute>
                  <LayoutWithPath>
                    <AdminReports />
                  </LayoutWithPath>
                </AdminRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
