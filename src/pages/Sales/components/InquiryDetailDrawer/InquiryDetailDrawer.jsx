import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { salesInquiryService } from "../../../../services/api";
import { useUser } from "../../../../context/UserContext";
import { formatDate } from "../../../../utils/dateUtils";
import {
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCheckCircle,
  FiAlertTriangle,
  FiBook,
  FiSave,
} from "react-icons/fi";
import styles from "./InquiryDetailDrawer.module.css";

const BADGE_CLASS = {
  new: styles.badgeNew,
  contacted: styles.badgeContacted,
  converted: styles.badgeConverted,
  lost: styles.badgeLost,
};

/**
 * Valid next statuses for each current status.
 * "new" is not settable via this endpoint (initial state only).
 */
const NEXT_STATUSES = {
  new: ["contacted", "lost"],
  contacted: ["converted", "lost"],
  converted: [],
  lost: [],
};

const TERMINAL = ["converted", "lost"];

const StatusBadge = ({ status }) => (
  <span className={[styles.badge, BADGE_CLASS[status] || ""].join(" ")}>
    {status}
  </span>
);

/**
 * InquiryDetailDrawer
 *
 * Slide-in panel that shows the full detail of a single sales inquiry.
 * Fetches full data (including message + salesNotes) on open.
 * Provides a CRM action section to update status + notes.
 *
 * @param {{
 *   inquiry: object | null,  // list-view inquiry object (for optimistic header)
 *   onClose: function,
 *   onUpdated: function,     // called after a successful status update
 * }} props
 */
const InquiryDetailDrawer = ({ inquiry: listInquiry, onClose, onUpdated }) => {
  const isOpen = Boolean(listInquiry);
  const inquiryId = listInquiry?._id;

  const queryClient = useQueryClient();

  // Fetch full detail (includes message + salesNotes)
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["salesInquiryDetail", inquiryId],
    queryFn: () => salesInquiryService.getInquiry(inquiryId),
    enabled: Boolean(inquiryId),
    staleTime: 0, // always fetch fresh data when opening
  });

  const inquiry = detailData?.inquiry || listInquiry || null;

  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isUnenrolling, setIsUnenrolling] = useState(false);
  const [unenrollReason, setUnenrollReason] = useState("");

  const { user } = useUser();
  const isAdmin = user?.role === "admin";

  // Reset local state when a new inquiry is opened.
  // Intentionally only re-runs on inquiryId change — the second effect
  // handles pre-filling notes once the detail query resolves.
  useEffect(() => {
    setSelectedStatus("");
    setNotes(inquiry?.salesNotes || "");
    setUnenrollReason("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inquiryId]);

  // Pre-populate notes if detail loads in
  useEffect(() => {
    if (detailData?.inquiry?.salesNotes) {
      setNotes(detailData.inquiry.salesNotes);
    }
  }, [detailData]);

  const currentStatus = inquiry?.status || "new";
  const nextStatuses = NEXT_STATUSES[currentStatus] || [];
  const isTerminal = TERMINAL.includes(currentStatus);

  const handleSave = useCallback(async () => {
    if (!selectedStatus) {
      await Swal.fire({
        icon: "warning",
        title: "Select a Status",
        text: "Please select a new status before saving.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    try {
      setIsSaving(true);
      await salesInquiryService.updateInquiryStatus(inquiryId, {
        status: selectedStatus,
        ...(notes.trim() ? { salesNotes: notes.trim() } : {}),
      });

      // Invalidate list and stats queries to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
      queryClient.invalidateQueries({ queryKey: ["salesStats"] });
      queryClient.invalidateQueries({
        queryKey: ["salesInquiryDetail", inquiryId],
      });

      await Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Inquiry moved to "${selectedStatus}".`,
        timer: 2000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      onUpdated?.();
      onClose();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update status. Please try again.";
      await Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: msg,
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsSaving(false);
    }
  }, [inquiryId, selectedStatus, notes, queryClient, onUpdated, onClose]);

  const handleEnroll = useCallback(async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Enroll this user?",
      html: `This will grant <strong>${inquiry?.fullName || "the user"}</strong> immediate course access and close the inquiry as <strong>Converted</strong>.<br/><br/>This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Enroll",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setIsEnrolling(true);
      await salesInquiryService.enrollUser(inquiryId, {
        ...(notes.trim() ? { salesNotes: notes.trim() } : {}),
      });

      queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
      queryClient.invalidateQueries({ queryKey: ["salesStats"] });
      queryClient.invalidateQueries({
        queryKey: ["salesInquiryDetail", inquiryId],
      });

      await Swal.fire({
        icon: "success",
        title: "User Enrolled!",
        text: "The user now has immediate course access.",
        timer: 2500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      onUpdated?.();
      onClose();
    } catch (error) {
      const httpStatus = error?.response?.status;
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      if (httpStatus === 400) {
        await Swal.fire({
          icon: "warning",
          title: "Cannot Enroll",
          text: msg,
          confirmButtonColor: "#2563eb",
        });
        // Row may have changed (e.g. already enrolled) — refresh
        queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
        queryClient.invalidateQueries({
          queryKey: ["salesInquiryDetail", inquiryId],
        });
        return;
      }

      if (httpStatus === 404) {
        await Swal.fire({
          icon: "error",
          title: "Inquiry Not Found",
          text: "This inquiry no longer exists.",
          confirmButtonColor: "#2563eb",
        });
        queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
        onClose();
        return;
      }

      // 5xx
      await Swal.fire({
        icon: "error",
        title: "Enrollment Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsEnrolling(false);
    }
  }, [inquiryId, notes, inquiry?.fullName, queryClient, onUpdated, onClose]);

  const handleUnenroll = useCallback(async () => {
    const trimmedReason = unenrollReason.trim();
    if (trimmedReason.length < 5) {
      await Swal.fire({
        icon: "warning",
        title: "Reason Required",
        text: "Please enter a reason of at least 5 characters before unenrolling.",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Revoke Course Access?",
      html: `This will remove <strong>${inquiry?.fullName || "the user"}</strong>'s access to this course and revert the inquiry to <strong>Contacted</strong>.<br/><br/>This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Confirm Unenroll",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d97706",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      setIsUnenrolling(true);
      await salesInquiryService.unenrollUser(inquiryId, {
        reason: trimmedReason,
      });

      queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
      queryClient.invalidateQueries({ queryKey: ["salesStats"] });
      queryClient.invalidateQueries({
        queryKey: ["salesInquiryDetail", inquiryId],
      });

      await Swal.fire({
        icon: "success",
        title: "User Unenrolled",
        text: "Course access has been revoked.",
        timer: 2500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      onUpdated?.();
      onClose();
    } catch (error) {
      const httpStatus = error?.response?.status;
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      if (httpStatus === 400) {
        await Swal.fire({
          icon: "warning",
          title: "Cannot Unenroll",
          text: msg,
          confirmButtonColor: "#2563eb",
        });
        queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
        queryClient.invalidateQueries({
          queryKey: ["salesInquiryDetail", inquiryId],
        });
        return;
      }

      if (httpStatus === 403) {
        await Swal.fire({
          icon: "error",
          title: "Permission Denied",
          text: "Only administrators can unenroll users.",
          confirmButtonColor: "#2563eb",
        });
        return;
      }

      if (httpStatus === 404) {
        await Swal.fire({
          icon: "error",
          title: "Inquiry Not Found",
          text: "This inquiry no longer exists.",
          confirmButtonColor: "#2563eb",
        });
        queryClient.invalidateQueries({ queryKey: ["salesInquiries"] });
        onClose();
        return;
      }

      // 5xx
      await Swal.fire({
        icon: "error",
        title: "Unenroll Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsUnenrolling(false);
    }
  }, [
    inquiryId,
    unenrollReason,
    inquiry?.fullName,
    queryClient,
    onUpdated,
    onClose,
  ]);

  // ESC closes drawer
  // Accessibility: Handle Escape key & Scroll freezing
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            role="complementary"
            aria-label="Inquiry detail"
          >
            {/* ── Header ─────────────────────────── */}
            <div className={styles.drawerHeader}>
              <div className={styles.headerInfo}>
                <h2 className={styles.drawerName}>
                  {inquiry?.fullName || "—"}
                </h2>
                <div className={styles.drawerMeta}>
                  <StatusBadge status={currentStatus} />
                  {isTerminal && (
                    <span className={styles.badgeTerminal}>
                      Terminal — no further changes
                    </span>
                  )}
                </div>
              </div>
              <button
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close drawer"
              >
                ×
              </button>
            </div>

            {/* ── Body ───────────────────────────── */}
            <div className={styles.drawerBody}>
              {isDetailLoading ? (
                <div className={styles.loadingWrap}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={styles.skeletonBlock}
                      style={{ width: `${60 + Math.random() * 35}%` }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* Contact Info */}
                  <div className={styles.section}>
                    <p className={styles.sectionTitle}>Contact</p>
                    <div className={styles.contactRow}>
                      <FiMail className={styles.contactIcon} />
                      <a
                        href={`mailto:${inquiry?.email}`}
                        className={styles.contactLink}
                      >
                        {inquiry?.email}
                      </a>
                    </div>
                    <div className={styles.contactRow}>
                      <FiPhone className={styles.contactIcon} />
                      <a
                        href={`https://wa.me/${inquiry?.whatsAppNumber?.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.contactLink}
                      >
                        {inquiry?.whatsAppNumber}
                      </a>
                    </div>
                    {inquiry?.company && (
                      <div className={styles.contactRow}>
                        <FiBriefcase className={styles.contactIcon} />
                        {inquiry.company}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  <div className={styles.section}>
                    <p className={styles.sectionTitle}>Timeline</p>
                    <div className={styles.timeline}>
                      <div className={styles.timelineItem}>
                        <span className={styles.timelineLabel}>Submitted</span>
                        <span className={styles.timelineValue}>
                          {formatDate(inquiry?.submittedAt)}
                        </span>
                      </div>
                      <div className={styles.timelineItem}>
                        <span className={styles.timelineLabel}>Contacted</span>
                        {inquiry?.contactedAt ? (
                          <span className={styles.timelineValue}>
                            {formatDate(inquiry.contactedAt)}
                          </span>
                        ) : (
                          <span className={styles.timelineNull}>Not yet</span>
                        )}
                      </div>
                      <div className={styles.timelineItem}>
                        <span className={styles.timelineLabel}>Resolved</span>
                        {inquiry?.resolvedAt ? (
                          <span className={styles.timelineValue}>
                            {formatDate(inquiry.resolvedAt)}
                          </span>
                        ) : (
                          <span className={styles.timelineNull}>Not yet</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User Message */}
                  <div className={styles.section}>
                    <p className={styles.sectionTitle}>Customer Message</p>
                    {inquiry?.message ? (
                      <div className={styles.textDisplay}>
                        {inquiry.message}
                      </div>
                    ) : (
                      <div
                        className={[styles.textDisplay, styles.textEmpty].join(
                          " ",
                        )}
                      >
                        No message provided.
                      </div>
                    )}
                  </div>

                  {/* Sales Notes */}
                  <div className={styles.section}>
                    <p className={styles.sectionTitle}>Sales Notes</p>
                    {!isTerminal && (
                      <p
                        style={{
                          fontSize: "0.77rem",
                          color: "#9ca3af",
                          margin: 0,
                        }}
                      >
                        Edit notes in the CRM section below.
                      </p>
                    )}
                    {isTerminal && inquiry?.salesNotes && (
                      <div className={styles.textDisplay}>
                        {inquiry.salesNotes}
                      </div>
                    )}
                    {isTerminal && !inquiry?.salesNotes && (
                      <div
                        className={[styles.textDisplay, styles.textEmpty].join(
                          " ",
                        )}
                      >
                        No notes.
                      </div>
                    )}
                  </div>

                  {/* CRM Action — hidden when terminal */}
                  {!isTerminal && (
                    <div className={styles.actionSection}>
                      <p className={styles.actionTitle}>Update Status</p>

                      {/* Status dropdown */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>New Status</label>
                        <select
                          className={styles.select}
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          aria-label="Select new inquiry status"
                        >
                          <option value="">— Select status —</option>
                          {nextStatuses.map((s) => (
                            <option key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Sales notes textarea */}
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Sales Notes
                          <span
                            style={{
                              fontWeight: 400,
                              color: "#9ca3af",
                              marginLeft: 4,
                            }}
                          >
                            (optional)
                          </span>
                        </label>
                        <textarea
                          className={styles.textarea}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          maxLength={2000}
                          placeholder="Log your call outcome, next steps, etc…"
                          aria-label="Sales notes"
                        />
                        <span
                          className={[
                            styles.charCount,
                            notes.length > 1900 ? styles.over : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {notes.length} / 2000
                        </span>
                      </div>

                      {/* Save button */}
                      <button
                        className={styles.saveBtn}
                        onClick={handleSave}
                        disabled={isSaving || !selectedStatus}
                      >
                        {isSaving ? (
                          <>
                            <span
                              className={styles.spinner}
                              aria-hidden="true"
                            />
                            Saving…
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>

                      {/* ── Enroll User ──────────────────── */}
                      <div className={styles.enrollDivider} />
                      <div className={styles.enrollSection}>
                        <div className={styles.enrollHeader}>
                          <FiBook
                            className={styles.enrollIcon}
                            aria-hidden="true"
                          />
                          <div>
                            <p className={styles.enrollTitle}>Enroll User</p>
                            <p className={styles.enrollDesc}>
                              This will grant the user immediate course access
                              and close the inquiry as &ldquo;Converted&rdquo;.
                            </p>
                          </div>
                        </div>
                        <button
                          className={styles.enrollBtn}
                          onClick={handleEnroll}
                          disabled={isEnrolling}
                          aria-label="Enroll this user in the course"
                        >
                          {isEnrolling ? (
                            <>
                              <span
                                className={styles.spinner}
                                aria-hidden="true"
                              />
                              Enrolling…
                            </>
                          ) : (
                            <>
                              <FiCheckCircle /> Confirm Enroll
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Unenroll User — admin only, converted status ── */}
                  {currentStatus === "converted" && isAdmin && (
                    <div className={styles.unenrollSection}>
                      <div className={styles.enrollHeader}>
                        <FiAlertTriangle
                          className={styles.enrollIcon}
                          aria-hidden="true"
                        />
                        <div>
                          <p className={styles.unenrollTitle}>
                            Revoke Course Access
                          </p>
                          <p className={styles.enrollDesc}>
                            This will remove the user&rsquo;s access to this
                            course and revert the inquiry to
                            &ldquo;Contacted&rdquo;.
                          </p>
                        </div>
                      </div>
                      <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                          Reason
                          <span
                            style={{
                              fontWeight: 400,
                              color: "#9ca3af",
                              marginLeft: 4,
                            }}
                          >
                            (required, min 5 chars)
                          </span>
                        </label>
                        <textarea
                          className={[
                            styles.textarea,
                            styles.unenrollTextarea,
                          ].join(" ")}
                          value={unenrollReason}
                          onChange={(e) => setUnenrollReason(e.target.value)}
                          maxLength={500}
                          placeholder="e.g. Enrolled wrong user by mistake"
                          aria-label="Unenroll reason"
                        />
                        <span
                          className={[
                            styles.charCount,
                            unenrollReason.length > 480 ? styles.over : "",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {unenrollReason.length} / 500
                        </span>
                      </div>
                      <button
                        className={styles.unenrollBtn}
                        onClick={handleUnenroll}
                        disabled={
                          isUnenrolling || unenrollReason.trim().length < 5
                        }
                        aria-label="Revoke course access for this user"
                      >
                        {isUnenrolling ? (
                          <>
                            <span
                              className={styles.spinner}
                              aria-hidden="true"
                            />
                            Unenrolling…
                          </>
                        ) : (
                          <>
                            <FiAlertTriangle /> Confirm Unenroll
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

InquiryDetailDrawer.propTypes = {
  inquiry: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onUpdated: PropTypes.func,
};

InquiryDetailDrawer.defaultProps = {
  inquiry: null,
  onUpdated: null,
};

export default InquiryDetailDrawer;
