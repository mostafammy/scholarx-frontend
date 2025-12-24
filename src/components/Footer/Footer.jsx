import React from 'react';
import './Footer.css';
import { FaTwitter, FaLinkedin, FaFacebook, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">ScholarX</h3>
          <p className="footer-description">
            Empowering academic success through personalized support and mentorship
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/about">About Us</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/courses">Courses</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href="mailto:scholarx.gmail@eg.com">Info@scholar-x.com</a>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <p>+(20) 1012072516</p>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Follow Us</h4>
          <div className="social-links">
            <a href="#" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="#" aria-label="Facebook"><FaFacebook /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2025 ScholarX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
