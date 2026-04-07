import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const PROFILE_LABELS = {
  highSchool: "High School",
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  professional: "Professional",
  other: "Other",
  legacy: "Legacy",
};

const GOAL_LABELS = {
  "find-scholarship": "Find Scholarship",
  "develop-skills": "Develop Skills",
  "build-network": "Build Network",
  "accelerate-career": "Accelerate Career",
  "meet-industry-experts": "Meet Experts",
  "something-else": "Something Else",
  other: "Other",
};

const formatText = (value) =>
  String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const RegistrantDrawer = ({ registrant, isOpen, onClose, onDelete }) => {
  if (!isOpen || !registrant) return null;

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const confirmation = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmation.isConfirmed) {
      try {
        setIsDeleting(true);
        await onDelete(registrant._id || registrant.id);
        Swal.fire("Deleted!", "Registration has been deleted.", "success");
      } catch (error) {
        Swal.fire(
          "Error",
          error.message || "Failed to delete registration",
          "error",
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const details = registrant.profileDetails || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 999,
            }}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
            animate={{ x: 0, boxShadow: "-10px 0 30px rgba(0,0,0,0.5)" }}
            exit={{ x: "100%", boxShadow: "0 0 0 rgba(0,0,0,0)" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="summit-glass-card"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              maxWidth: "400px",
              zIndex: 1000,
              borderRight: "none",
              borderRadius: "24px 0 0 24px",
              padding: "32px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              backgroundColor: "rgba(13,21,41,0.95)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--s-font-display)",
                  margin: 0,
                  fontSize: "1.5rem",
                  color: "#fff",
                }}
              >
                Profile Detail
              </h2>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                }}
              >
                ✕
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "bold",
                  color: "var(--s-gold-400)",
                  fontFamily: "var(--s-font-display)",
                }}
              >
                {registrant.fullName}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--s-text-300)",
                }}
              >
                <span>{registrant.email}</span>
                <a
                  href={`mailto:${registrant.email}`}
                  style={{ color: "var(--s-blue-400)", textDecoration: "none" }}
                >
                  [Email]
                </a>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--s-text-300)",
                }}
              >
                <span>{registrant.phone || "No phone"}</span>
                {registrant.phone && (
                  <a
                    href={`https://wa.me/${registrant.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#25D366", textDecoration: "none" }}
                  >
                    [WhatsApp]
                  </a>
                )}
              </div>
              <div
                style={{
                  color: "var(--s-text-300)",
                  fontFamily: "monospace",
                  fontSize: "0.9rem",
                }}
              >
                National ID: {registrant.nationalId || "—"}
              </div>
            </div>

            <div
              style={{ height: "1px", background: "rgba(255,255,255,0.1)" }}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--s-text-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Governorate
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {registrant.governorate?.replace(/-/g, " ") || "—"}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--s-text-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {formatText(registrant.registrationStatus || "new")}
                </div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--s-text-400)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Profile Type
                </div>
                <div style={{ color: "#fff", fontWeight: 500 }}>
                  {PROFILE_LABELS[registrant.profileType] || "Legacy"}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "8px",
              }}
            >
              {registrant.profileType === "highSchool" && (
                <>
                  <div style={{ color: "#fff" }}>
                    <strong>High School:</strong>{" "}
                    {details.highSchoolName || "—"}
                  </div>
                  <div style={{ color: "#fff" }}>
                    <strong>Year:</strong>{" "}
                    {formatText(details.highSchoolYear) || "—"}
                  </div>
                </>
              )}
              {(registrant.profileType === "undergraduate" ||
                registrant.profileType === "graduate") && (
                <>
                  <div style={{ color: "#fff" }}>
                    <strong>University:</strong>{" "}
                    {details.universityName || registrant.university || "—"}
                  </div>
                  <div style={{ color: "#fff" }}>
                    <strong>Major:</strong>{" "}
                    {details.major || registrant.fieldOfStudy || "—"}
                  </div>
                  {details.undergraduateYear && (
                    <div style={{ color: "#fff" }}>
                      <strong>Year:</strong>{" "}
                      {formatText(details.undergraduateYear)}
                    </div>
                  )}
                </>
              )}
              {registrant.profileType === "professional" && (
                <>
                  <div style={{ color: "#fff" }}>
                    <strong>Job Title:</strong> {details.jobTitle || "—"}
                  </div>
                  <div style={{ color: "#fff" }}>
                    <strong>Experience:</strong>{" "}
                    {details.yearsOfExperience ?? "—"} years
                  </div>
                </>
              )}
              {registrant.profileType === "other" && (
                <div style={{ color: "#fff" }}>
                  <strong>Profile:</strong> {details.profileDescription || "—"}
                </div>
              )}
              {(!registrant.profileType ||
                registrant.profileType === "legacy") && (
                <>
                  <div style={{ color: "#fff" }}>
                    <strong>University:</strong> {registrant.university || "—"}
                  </div>
                  <div style={{ color: "#fff" }}>
                    <strong>Field of Study:</strong>{" "}
                    {registrant.fieldOfStudy || "—"}
                  </div>
                  <div style={{ color: "#fff" }}>
                    <strong>Academic Status:</strong>{" "}
                    {formatText(registrant.status) || "—"}
                  </div>
                </>
              )}
            </div>

            <div
              style={{ height: "1px", background: "rgba(255,255,255,0.1)" }}
            />

            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--s-text-400)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Primary Goals
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {(registrant.primaryGoals || []).length > 0 ? (
                  registrant.primaryGoals.map((goal) => (
                    <span
                      key={goal}
                      style={{
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        color: "#fff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {GOAL_LABELS[goal] || formatText(goal)}
                    </span>
                  ))
                ) : (
                  <span style={{ color: "var(--s-text-400)" }}>
                    None selected
                  </span>
                )}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--s-text-400)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Selected Tracks
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {registrant.tracks?.map((t) => (
                  <span
                    key={t}
                    style={{
                      background: "rgba(245,197,24,0.1)",
                      border: "1px solid rgba(245,197,24,0.3)",
                      color: "var(--s-gold-400)",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.85rem",
                    }}
                  >
                    {t.replace(/-/g, " ")}
                  </span>
                )) || (
                  <span style={{ color: "var(--s-text-400)" }}>
                    None selected
                  </span>
                )}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--s-text-400)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Source
              </div>
              <div
                style={{ color: "#fff", fontSize: "0.9rem", lineHeight: 1.5 }}
              >
                {registrant.referralSources?.join(", ") || "—"}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--s-text-400)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "8px",
                }}
              >
                Registered At
              </div>
              <div style={{ color: "#fff", fontSize: "0.9rem" }}>
                {new Date(registrant.createdAt || Date.now()).toLocaleString(
                  "en-EG",
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RegistrantDrawer;
