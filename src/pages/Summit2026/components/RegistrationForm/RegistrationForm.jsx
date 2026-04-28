/**
 * @fileoverview RegistrationForm — Only shows Google Form registration CTA.
 */

import React from "react";
import { motion } from "framer-motion";

const RegistrationForm = () => {
  return (
    <section
      id="registration"
      className="summit-section summit-registration"
      aria-labelledby="registration-heading"
    >
      <div className="summit-container">
        <div className="summit-section-header">
          <div className="summit-badge" aria-hidden="true">
            📝 Free Registration
          </div>
          <h2 id="registration-heading" className="summit-section-title">
            Register and Join the Summit
          </h2>
          <p className="summit-section-subtitle">
            Seats are very limited and reserved for the most committed
            participants. Do not miss your chance to be where opportunities are
            created.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 40 }}
        >
          {/* Card */}
          <div
            id="google-form-fallback-card"
            style={{
              position: "relative",
              overflow: "hidden",
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "32px 40px",
              backdropFilter: "blur(40px) saturate(130%)",
              WebkitBackdropFilter: "blur(40px) saturate(130%)",
              boxShadow:
                "0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(66,133,244,0.25)";
              e.currentTarget.style.boxShadow =
                "0 12px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(66,133,244,0.1), inset 0 1px 0 rgba(255,255,255,0.09)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow =
                "0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)";
            }}
          >
            {/* Google-blue / red top-accent bar */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(66,133,244,0.6) 40%, rgba(234,67,53,0.5) 60%, transparent 100%)",
                borderRadius: "24px 24px 0 0",
              }}
            />

            {/* Ambient glow blob */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 220,
                height: 220,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(66,133,244,0.08) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            {/* Content row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                flexWrap: "wrap",
              }}
            >
              {/* Icon badge */}
              <div
                style={{
                  flexShrink: 0,
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background:
                    "linear-gradient(135deg, rgba(66,133,244,0.18) 0%, rgba(234,67,53,0.08) 100%)",
                  border: "1px solid rgba(66,133,244,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(66,133,244,0.15)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <rect
                    x="8"
                    y="2"
                    width="32"
                    height="44"
                    rx="4"
                    fill="#673AB7"
                    fillOpacity="0.9"
                  />
                  <rect
                    x="8"
                    y="2"
                    width="32"
                    height="44"
                    rx="4"
                    fill="url(#gf-grad2)"
                    fillOpacity="0.15"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="20"
                    height="2.5"
                    rx="1.25"
                    fill="white"
                    fillOpacity="0.9"
                  />
                  <rect
                    x="14"
                    y="20"
                    width="14"
                    height="2.5"
                    rx="1.25"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <rect
                    x="14"
                    y="26"
                    width="17"
                    height="2.5"
                    rx="1.25"
                    fill="white"
                    fillOpacity="0.6"
                  />
                  <rect
                    x="14"
                    y="32"
                    width="11"
                    height="2.5"
                    rx="1.25"
                    fill="white"
                    fillOpacity="0.5"
                  />
                  <defs>
                    <linearGradient
                      id="gf-grad2"
                      x1="8"
                      y1="2"
                      x2="40"
                      y2="46"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#4285F4" />
                      <stop offset="1" stopColor="#EA4335" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Text block */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontFamily: "var(--s-font-display)",
                    color: "rgba(66,133,244,0.85)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    fontWeight: 700,
                    marginBottom: 6,
                  }}
                >
                  Official Registration
                </div>
                <h3
                  style={{
                    fontFamily: "var(--s-font-display)",
                    fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
                    fontWeight: 700,
                    color: "var(--s-text-100)",
                    lineHeight: 1.25,
                    margin: "0 0 8px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Register via Google Form
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--s-text-400)",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 460,
                  }}
                >
                  Please fill out the official Google Form to secure your spot
                  at the Next Scholar Summit 2026.
                </p>
              </div>

              {/* CTA Button */}
              <div style={{ flexShrink: 0 }}>
                <a
                  id="google-form-fallback-cta"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdIDeHaSu6KcpRBbSZZtixCzMmIYvoGMIFesM_8G1XiMsjTeQ/viewform?usp=publish-editor"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Open registration Google Form in a new tab"
                  className="summit-gform-cta"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Open Form
                </a>
              </div>
            </div>

            {/* Bottom disclaimer */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(66,133,244,0.7)",
                  flexShrink: 0,
                  boxShadow: "0 0 6px rgba(66,133,244,0.5)",
                }}
              />
              <p
                style={{
                  fontSize: "0.76rem",
                  color: "rgba(255,255,255,0.3)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                This is the official channel. All form data is managed securely
                by the Next Scholar Summit 2026 organizing team.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Beautiful Support / Help Contact Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{ marginTop: 40, display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 100,
              padding: "10px 24px 10px 10px",
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(245,197,24,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(245,197,24,0.15), rgba(255,159,28,0.05))",
                border: "1px solid rgba(245,197,24,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.3rem",
                color: "#f5c518",
                boxShadow: "0 4px 12px rgba(245,197,24,0.15)",
              }}
            >
              🎧
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.45)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 2,
                }}
              >
                Facing any issues?
              </div>
              <div
                style={{ fontSize: "1rem", color: "#e2e8f0", fontWeight: 500 }}
              >
                We're here to help!{" "}
                <a
                  href="https://wa.me/201012072516"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#f5c518",
                    textDecoration: "none",
                    marginLeft: 4,
                    fontWeight: 700,
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#ff9f1c")}
                  onMouseLeave={(e) => (e.target.style.color = "#f5c518")}
                >
                  Contact 01012072516
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default React.memo(RegistrationForm);
