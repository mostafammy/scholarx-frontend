import React from "react";
import "./Footer.css";
import {
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import {
  CONTACT_INFO,
  COMPANY_INFO,
  SOCIAL_LINKS,
  LEGAL_PAGES,
} from "../../utils/constants";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">{COMPANY_INFO.name}</h3>
          <p className="footer-description">{COMPANY_INFO.tagline}</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/services">Services</a>
            </li>
            <li>
              <a href="/courses">Courses</a>
            </li>
            <li>
              <a href={LEGAL_PAGES.privacyPolicy}>Privacy Policy</a>
            </li>
            <li>
              <a href={LEGAL_PAGES.termsOfService}>Terms of Service</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contact</h4>
          <div className="contact-info">
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a>
            </div>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <p>{CONTACT_INFO.phone}</p>
            </div>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Follow Us</h4>
          <div className="social-links">
            <a href={SOCIAL_LINKS.twitter} aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href={SOCIAL_LINKS.linkedin} aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href={SOCIAL_LINKS.facebook} aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href={SOCIAL_LINKS.instagram} aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {COMPANY_INFO.foundedYear} {COMPANY_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
