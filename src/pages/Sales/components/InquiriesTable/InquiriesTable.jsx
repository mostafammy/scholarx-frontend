import React, { memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { FiInbox, FiExternalLink } from "react-icons/fi";
import { formatDate } from "../../../../utils/dateUtils";
import styles from "./InquiriesTable.module.css";

const TABS = [
  { key: "", label: "All" },
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "converted", label: "Converted" },
  { key: "lost", label: "Lost" },
];

const BADGE_CLASS = {
  new: styles.badgeNew,
  contacted: styles.badgeContacted,
  converted: styles.badgeConverted,
  lost: styles.badgeLost,
};

const StatusBadge = ({ status }) => (
  <span className={[styles.badge, BADGE_CLASS[status] || ""].join(" ")}>
    {status}
  </span>
);

/** Renders 5 skeleton rows while data is loading */
const SkeletonRows = () =>
  Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className={styles.placeholderRow}>
      {Array.from({ length: 7 }).map((__, j) => (
        <td key={j}>
          <div
            className={[
              styles.skeletonLine,
              j % 2 === 0 ? styles.short : styles.xshort,
            ].join(" ")}
          />
        </td>
      ))}
    </tr>
  ));

/**
 * InquiriesTable
 *
 * Displays inquiry records with filter tabs and pagination.
 * Clicking a row calls onViewInquiry(inquiry) to open the detail drawer.
 */
const InquiriesTable = ({
  items,
  pagination,
  activeStatus,
  onStatusChange,
  onPageChange,
  onViewInquiry,
  isLoading,
  stats,
}) => {
  const { currentPage, totalPages, totalItems } = pagination || {};

  return (
    <div className={styles.wrapper}>
      {/* ── Status filter tabs ─────────────────── */}
      <div
        className={styles.tabs}
        role="tablist"
        aria-label="Filter inquiries by status"
      >
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeStatus === key}
            className={[styles.tab, activeStatus === key ? styles.active : ""]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onStatusChange(key)}
          >
            {label}
            {stats && (
              <span className={styles.tabCount}>
                {key === "" ? (stats.total ?? 0) : (stats[key] ?? 0)}
              </span>
            )}
            {activeStatus === key && (
              <motion.div
                layoutId="activeTabIndicator"
                className={styles.activeTabIndicator}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Table ─────────────────────────────── */}
      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label="Inquiries list">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">WhatsApp</th>
              <th scope="col">Company</th>
              <th scope="col">Submitted</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows />
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <FiInbox className={styles.emptyIcon} />
                    <p>
                      No inquiries found{" "}
                      {activeStatus ? ` with status "${activeStatus}"` : ""}.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((inquiry) => (
                  <motion.tr
                    layout="position"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    key={inquiry._id}
                    className={styles.row}
                    onClick={() => onViewInquiry(inquiry)}
                    aria-label={`View inquiry from ${inquiry.fullName}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onViewInquiry(inquiry);
                    }}
                  >
                    <td>
                      <div className={styles.cellName}>{inquiry.fullName}</div>
                    </td>
                    <td>
                      <a
                        href={`mailto:${inquiry.email}`}
                        className={styles.cellLink}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                      >
                        {inquiry.email}
                      </a>
                    </td>
                    <td>
                      <a
                        href={`https://wa.me/${inquiry.whatsAppNumber?.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cellLink}
                        onClick={(e) => e.stopPropagation()}
                        tabIndex={-1}
                      >
                        {inquiry.whatsAppNumber}
                      </a>
                    </td>
                    <td>
                      {inquiry.company ? (
                        <span className={styles.cellSub}>
                          {inquiry.company}
                        </span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>
                    <td>{formatDate(inquiry.submittedAt)}</td>
                    <td>
                      <StatusBadge status={inquiry.status} />
                    </td>
                    <td>
                      <button
                        className={styles.viewBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewInquiry(inquiry);
                        }}
                        tabIndex={-1}
                        aria-label={`View details for ${inquiry.fullName}`}
                      >
                        View <FiExternalLink size={14} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────── */}
      {!isLoading && items.length > 0 && (
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {totalItems} total inquir{totalItems === 1 ? "y" : "ies"}
          </span>
          <div className={styles.paginationControls}>
            <button
              className={styles.pageBtn}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              aria-label="Previous page"
            >
              ‹
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} / {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

InquiriesTable.propTypes = {
  items: PropTypes.array,
  pagination: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
    totalItems: PropTypes.number,
    hasNextPage: PropTypes.bool,
    hasPreviousPage: PropTypes.bool,
  }),
  activeStatus: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onViewInquiry: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  stats: PropTypes.object,
};

InquiriesTable.defaultProps = {
  items: [],
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0 },
  activeStatus: "",
  isLoading: false,
  stats: null,
};

export { StatusBadge };
export default memo(InquiriesTable);
