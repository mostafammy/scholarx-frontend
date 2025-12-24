import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './NavBar.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { FiLogOut } from 'react-icons/fi';
import defaultAvatar from '../../assets/Images/image.png';
import { FaUserCircle } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { getUserAvatarUrl } from '../../utils/imageUtils';
// import { API_URL } from '../../utils/api';

function NavBar({ activePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, isAdmin } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useUser();

  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    // If activePage prop is provided, use it; otherwise use window.location.pathname
    setCurrentPath(activePage || window.location.pathname);
    
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500); 
    }
  }, [activePage]);

  // Close mobile menu and dropdown on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [currentPath]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    closeMobileMenu();
    navigate('/');
  };

  const handleAvatarClick = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  const renderAuthButtons = (isMobile = false) => {
    if (isAuthenticated) {
      if (isMobile) {
        // Mobile: return profile, admin, and logout as simple links/buttons
        return (
          <>
            <Link to="/profile" className="sx-mobile-nav-item" onClick={closeMobileMenu}>
              My Profile
            </Link>
            <Link to="/certificates" className="sx-mobile-nav-item" onClick={closeMobileMenu}>
              My Certificates
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" className="sx-mobile-nav-item" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            )}
            <button className="sx-mobile-nav-item sx-logout-mobile-btn" onClick={handleLogout}>
              <FiLogOut style={{ marginRight: 8 }} /> Logout
            </button>
          </>
        );
      } else {
        // Desktop: show avatar with dropdown
        return (
          <div className="sx-user-avatar-wrapper">
            <div className="sx-user-avatar" onClick={handleAvatarClick}>
              <img 
                src={getUserAvatarUrl(user, defaultAvatar)} 
                alt="User Avatar" 
                className="sx-avatar-img" 
              />
            </div>
            {dropdownOpen && (
              <div className="sx-user-dropdown">
                <button onClick={handleProfile} className="sx-dropdown-item">My Profile</button>
                {user && user.courses && user.courses.length > 0 && (
                  <Link to="/mycourses" onClick={closeMobileMenu} className="sx-dropdown-item">
                    My Courses
                  </Link>
                )}
                <Link to="/certificates" onClick={closeMobileMenu} className="sx-dropdown-item">
                  My Certificates
                </Link>
                {isAdmin && (
                  <Link to="/admin/dashboard" onClick={closeMobileMenu} className="sx-dropdown-item">
                     Dashboard
                  </Link>
                )}
                <button className="sx-dropdown-item" onClick={handleLogout}>
                  <FiLogOut style={{ marginRight: 8 }} /> Logout
                </button>
              </div>
            )}
          </div>
        );
      }
    }
    return (
      <>
        <Link to="/signup" onClick={closeMobileMenu} className="sx-mobile-auth-link">
          <button className="sx-signup-btn">Sign Up</button>
        </Link>
        <Link to="/login" onClick={closeMobileMenu} className="sx-mobile-auth-link">
          <button className="sx-login-btn">Login</button>
        </Link>
      </>
    );
  };

  return (
    <>

    <nav className="sx-navbar">


      <div className="sx-container">


        <div className="sx-navbar-logo col-md-3">
          <Link to="/">
            <img src="/home-page/logo.png" alt="ScholarX Logo" />
            <span></span>
          </Link>
        </div>

        <button className="sx-mobile-menu-btn" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? '✕' : '☰'}
        </button>



        <div className={`sx-navbar-links col-md-6 d-md-flex justify-content-center ${mobileMenuOpen ? 'sx-active' : ''}`}>
          <Link to="/" className={currentPath === '/' ? 'sx-active' : ''} onClick={closeMobileMenu}>Home</Link>
          <Link to="/about" className={currentPath === '/about' ? 'sx-active' : ''} onClick={closeMobileMenu}>About Us</Link>
          <Link to="/services" className={currentPath === '/services' ? 'sx-active' : ''} onClick={closeMobileMenu}>Our Services</Link>
          <div className="sx-dropdown">
            <Link to="/courses" className={currentPath === '/courses' ? 'sx-active' : ''} onClick={closeMobileMenu}>Courses</Link>
          </div>
          <Link to="/contact" className={currentPath === '/contact' ? 'sx-active' : ''} onClick={closeMobileMenu}>Contact</Link>
          
          <div className="sx-mobile-auth">
            {renderAuthButtons(true)}
          </div>
        </div>



        <div className="sx-navbar-auth sx-desktop-auth col-md-3 d-flex justify-content-end">
          {renderAuthButtons(false)}
        </div>


      </div>
    </nav>
    </>
  );
}

export default NavBar;
