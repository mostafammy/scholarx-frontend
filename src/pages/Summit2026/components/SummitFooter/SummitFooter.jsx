/**
 * @fileoverview SummitFooter — Minimal, branded summit footer.
 */

import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { EVENT_META } from "../../constants/eventData";

const SummitFooter = () => {
  const isAdmin = useSelector((state) => {
    const auth = state?.auth;
    return Boolean(auth?.isAuthenticated && auth?.user?.role === "admin");
  });

  return (
    <footer className="summit-footer" role="contentinfo">
      <div className="summit-container">
        <div className="summit-footer-inner">
          <div className="summit-footer-brand" aria-label="Summit name">
            <span>{EVENT_META.name}</span>
          </div>

          <nav className="summit-footer-links" aria-label="Footer navigation">
            <a href="#summit-journey" className="summit-footer-link">
              Journey
            </a>
            <a href="#summit-tracks" className="summit-footer-link">
              Tracks
            </a>
            <a href="#summit-partners" className="summit-footer-link">
              Partners
            </a>
            <a href="#registration" className="summit-footer-link">
              Register
            </a>
            {isAdmin && (
              <Link to="/summit-2026/dashboard" className="summit-footer-link">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>

        <p className="summit-footer-copyright">
          © {new Date().getFullYear()} {EVENT_META.organizers.join(" & ")}. All
          rights reserved. Organized with excellence at{" "}
          <strong style={{ color: "var(--s-text-200)" }}>
            {EVENT_META.venue}
          </strong>
          .
        </p>
      </div>
    </footer>
  );
};

export default React.memo(SummitFooter);
