import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Spotlight Search (Cmd + K) for quick registrant lookup.
 */
const DashboardSpotlight = ({ registrations, onSelectRegistrant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Keyboard listeners for opening/closing
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Close on Escape
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const filteredResults = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return registrations
      .filter((r) => {
        return (
          (r.fullName && r.fullName.toLowerCase().includes(q)) ||
          (r.email && r.email.toLowerCase().includes(q)) ||
          (r.phone && r.phone.includes(q)) ||
          (r.nationalId && String(r.nationalId).includes(q))
        );
      })
      .slice(0, 5); // show top 5 matches
  }, [query, registrations]);

  // Handle keyboard navigation within the list
  const handleDialogKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  const handleSelect = (registrant) => {
    setIsOpen(false);
    onSelectRegistrant(registrant);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(8px)",
                zIndex: 9999,
              }}
            />

            {/* Spotlight Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
              animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: "fixed",
                top: "20%",
                left: "50%",
                width: "90%",
                maxWidth: "600px",
                backgroundColor: "rgba(13,21,41,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(245,197,24,0.3)",
                zIndex: 10000,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              role="dialog"
              aria-modal="true"
            >
              {/* Search Input Area */}
              <div style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.4)", marginRight: "16px" }}>🔍</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleDialogKeyDown}
                  placeholder="Search by name, email, phone, or ID..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    color: "#fff",
                    fontSize: "1.2rem",
                    outline: "none",
                    fontFamily: "var(--s-font-body)",
                  }}
                />
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>
                  ESC
                </div>
              </div>

              {/* Results Area */}
              <div style={{ maxHeight: "300px", overflowY: "auto", padding: query.trim() ? "8px 0" : "0" }}>
                {!query.trim() && (
                  <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "0.9rem" }}>
                    Type to start searching...
                  </div>
                )}
                
                {query.trim() && filteredResults.length === 0 && (
                  <div style={{ padding: "32px", textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}>
                    No registrants found for "{query}"
                  </div>
                )}

                {filteredResults.map((r, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={r._id || r.id}
                      onClick={() => handleSelect(r)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        padding: "12px 24px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: isSelected ? "rgba(245,197,24,0.1)" : "transparent",
                        borderLeft: isSelected ? "3px solid var(--s-gold-400)" : "3px solid transparent",
                      }}
                    >
                      <div>
                        <div style={{ color: isSelected ? "#fff" : "rgba(255,255,255,0.8)", fontWeight: isSelected ? 600 : 400, fontSize: "1rem" }}>
                          {r.fullName}
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "4px" }}>
                          {r.email} • {r.phone || r.nationalId || "No phone/ID"}
                        </div>
                      </div>
                      <div style={{ color: isSelected ? "var(--s-gold-400)" : "rgba(255,255,255,0.2)", fontSize: "0.85rem" }}>
                        {r.profileType === "highSchool" ? "High School" : r.profileType === "undergraduate" ? "Undergraduate" : r.profileType === "professional" ? "Professional" : "Other"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSpotlight;
