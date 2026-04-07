/**
 * @fileoverview RegistrantsTable — Sortable, searchable data table for admin dashboard.
 * Pure UI — receives data + callbacks. No data fetching. No state.
 */

import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import { registrationRepository } from "../../services/RegistrationRepository";
import RegistrantDrawer from "./RegistrantDrawer";

/**
 * Formats an ISO timestamp to a readable local date/time string.
 * @param {string} iso
 * @returns {string}
 */
const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-EG", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

/** Column definition for the table header */
const COLUMNS = [
  { field: "fullName", label: "Registrant", sortable: true },
  { field: "nationalId", label: "National ID", sortable: false },
  { field: "profileType", label: "Profile", sortable: false },
  { field: "registrationStatus", label: "Workflow", sortable: false },
  { field: "tracks", label: "Goals & Tracks", sortable: false },
  { field: "createdAt", label: "Registered At", sortable: true },
];

/**
 * Status colors mapping
 */
const STATUS_COLORS = {
  new: {
    bg: "rgba(255,255,255,0.1)",
    color: "#fff",
    border: "rgba(255,255,255,0.2)",
  },
  contacted: {
    bg: "rgba(79,195,247,0.1)",
    color: "#4fc3f7",
    border: "rgba(79,195,247,0.3)",
  },
  confirmed: {
    bg: "rgba(105,240,174,0.1)",
    color: "#69f0ae",
    border: "rgba(105,240,174,0.3)",
  },
  "checked-in": {
    bg: "rgba(76,175,80,0.15)",
    color: "#81c784",
    border: "rgba(129,199,132,0.35)",
  },
  cancelled: {
    bg: "rgba(255,107,107,0.12)",
    color: "#ff8a80",
    border: "rgba(255,138,128,0.35)",
  },
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

const PROFILE_LABELS = {
  highSchool: "High School",
  undergraduate: "Undergraduate",
  graduate: "Graduate",
  professional: "Professional",
  other: "Other",
  legacy: "Legacy",
};

const formatNationalId = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 14) return "—";
  return `${digits.slice(0, 1)}-${digits.slice(1, 7)}-${digits.slice(7)}`;
};

const toTitleText = (value) =>
  String(value || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const getProfileSummary = (reg) => {
  const details = reg?.profileDetails || {};
  const type = reg?.profileType;

  if (type === "highSchool") {
    const school = details.highSchoolName || "High School";
    const year = details.highSchoolYear
      ? toTitleText(details.highSchoolYear)
      : "—";
    return `${school} · ${year}`;
  }

  if (type === "undergraduate") {
    const uni = details.universityName || reg.university || "University";
    const major = details.major || reg.fieldOfStudy || "—";
    const year = details.undergraduateYear
      ? ` · ${toTitleText(details.undergraduateYear)}`
      : "";
    return `${uni} · ${major}${year}`;
  }

  if (type === "graduate") {
    const uni = details.universityName || reg.university || "University";
    const major = details.major || reg.fieldOfStudy || "—";
    return `${uni} · ${major}`;
  }

  if (type === "professional") {
    const title = details.jobTitle || "Professional";
    const years = Number.isFinite(Number(details.yearsOfExperience))
      ? ` · ${details.yearsOfExperience} yrs`
      : "";
    return `${title}${years}`;
  }

  if (type === "other") {
    return details.profileDescription || "Custom profile";
  }

  return `${reg.university || "—"} · ${reg.fieldOfStudy || "—"}`;
};

/**
 * @param {{
 *   registrations: import('../../services/RegistrationRepository').Registration[],
 *   filtered: import('../../services/RegistrationRepository').Registration[],
 *   sortField: string,
 *   sortDirection: 'asc' | 'desc',
 *   toggleSort: (field: string) => void,
 *   exportFilteredCsv: () => Promise<void>,
 *   hasNextPage?: boolean,
 *   isLoadingMore?: boolean,
 *   loadMore?: () => Promise<void>,
 * }} props
 */
const RegistrantsTable = ({
  registrations,
  filtered,
  sortField,
  sortDirection,
  toggleSort,
  deleteRegistration,
  exportFilteredCsv,
  hasNextPage = false,
  isLoadingMore = false,
  loadMore,
  refresh, // We need refresh for bulk actions
}) => {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeRegistrant, setActiveRegistrant] = useState(null);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const isAllSelected = useMemo(() => {
    return filtered.length > 0 && selectedIds.size === filtered.length;
  }, [filtered.length, selectedIds.size]);

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r._id || r.id)));
    }
  }, [isAllSelected, filtered]);

  const toggleSelectRow = useCallback((e, id) => {
    e.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleRowClick = useCallback((reg) => {
    setActiveRegistrant(reg);
  }, []);
  const handleExport = useCallback(() => {
    exportFilteredCsv();
  }, [exportFilteredCsv]);

  const handleBulkExport = useCallback(() => {
    // Basic CSV generation for selected rows
    const selectedRows = filtered.filter((r) => selectedIds.has(r._id || r.id));
    if (selectedRows.length === 0) return;

    // Create a simple CSV locally since we already have the data
    const headers = [
      "Name",
      "Email",
      "Phone",
      "National ID",
      "Governorate",
      "Profile Type",
      "Workflow Status",
      "Registered At",
    ];
    const rows = selectedRows.map((r) => [
      `"${r.fullName || ""}"`,
      `"${r.email || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.nationalId || ""}"`,
      `"${r.governorate || ""}"`,
      `"${r.profileType || "legacy"}"`,
      `"${r.registrationStatus || "new"}"`,
      `"${new Date(r.createdAt || Date.now()).toISOString()}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summit-selected-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filtered, selectedIds]);

  const handleBulkUpdateStatus = useCallback(
    async (status) => {
      setIsBulkLoading(true);
      try {
        const updates = Array.from(selectedIds).map((id) =>
          registrationRepository
            .updateStatus(id, status)
            .catch((e) => console.error(e)),
        );
        await Promise.all(updates);
        setSelectedIds(new Set());
        if (refresh) refresh();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Updated ${updates.length} rows to ${status}`,
          showConfirmButton: false,
          timer: 2000,
          background: "#0d1529",
          color: "#fff",
        });
      } finally {
        setIsBulkLoading(false);
      }
    },
    [selectedIds, refresh],
  );

  const handleDeleteSelectedOne = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length !== 1) {
      return;
    }

    const id = ids[0];
    const target = filtered.find((r) => (r._id || r.id) === id);
    const targetName = target?.fullName || "this registration";

    const result = await Swal.fire({
      title: "Delete selected registration?",
      html: `<p style="color:#e2e8f0;">This will permanently delete <strong style="color:#f5c518">${targetName}</strong>.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ff6b6b",
      cancelButtonColor: "#374151",
      background: "#0d1529",
      color: "#ffffff",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteRegistration(id);
      setSelectedIds(new Set());
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Registration deleted",
        showConfirmButton: false,
        timer: 1800,
        background: "#0d1529",
        color: "#fff",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: error?.message || "Could not delete the selected registration.",
        background: "#0d1529",
        color: "#fff",
      });
    }
  }, [selectedIds, filtered, deleteRegistration]);

  return (
    <div>
      {/* Toolbar */}
      <div className="summit-db-table-toolbar">
        <p className="summit-db-table-count">
          Showing <strong>{filtered.length}</strong> of{" "}
          <strong>{registrations.length}</strong> registrations
        </p>
        <div className="summit-db-table-actions">
          {hasNextPage && loadMore && (
            <button
              type="button"
              id="db-load-more-btn"
              className="summit-db-btn-secondary"
              onClick={loadMore}
              disabled={isLoadingMore}
              aria-label="Load more registrations"
            >
              {isLoadingMore ? "Loading more..." : "Load More"}
            </button>
          )}
          <button
            type="button"
            id="db-export-btn"
            className="summit-db-btn-export"
            onClick={handleExport}
            disabled={filtered.length === 0}
            aria-label={`Export ${filtered.length} filtered registrations to CSV`}
          >
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="summit-db-table-wrap">
        {filtered.length === 0 ? (
          <div className="summit-db-empty" role="status" aria-live="polite">
            <div className="summit-db-empty-icon" aria-hidden="true">
              {registrations.length === 0 ? "📭" : "🔍"}
            </div>
            <p className="summit-db-empty-title">
              {registrations.length === 0
                ? "No Registrations Yet"
                : "No Results Found"}
            </p>
            <p className="summit-db-empty-desc">
              {registrations.length === 0
                ? "Registrations will appear here as people sign up at the summit page."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <table
            className="summit-db-table"
            aria-label="Registrations data table"
          >
            <thead>
              <tr>
                <th scope="col" style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    style={{
                      cursor: "pointer",
                      accentColor: "var(--s-gold-500)",
                    }}
                  />
                </th>
                <th scope="col" style={{ width: 32 }}>
                  #
                </th>
                {COLUMNS.map(({ field, label, sortable }) => (
                  <th
                    key={field}
                    scope="col"
                    className={[
                      sortable ? "sortable" : "",
                      sortField === field ? "sort-active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={sortable ? () => toggleSort(field) : undefined}
                    aria-sort={
                      sortField === field
                        ? sortDirection === "asc"
                          ? "ascending"
                          : "descending"
                        : sortable
                          ? "none"
                          : undefined
                    }
                  >
                    {label}
                    {sortable && (
                      <span className="summit-db-sort-icon" aria-hidden="true">
                        {sortField === field
                          ? sortDirection === "asc"
                            ? " ▲"
                            : " ▼"
                          : " ↕"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg, idx) => {
                const id = reg._id || reg.id;
                const isSelected = selectedIds.has(id);
                const workflowStatus = String(
                  reg.registrationStatus || "new",
                ).toLowerCase();
                const statusInfo =
                  STATUS_COLORS[workflowStatus] || STATUS_COLORS.new;

                return (
                  <tr
                    key={id}
                    onClick={() => handleRowClick(reg)}
                    style={{
                      cursor: "pointer",
                      background: isSelected
                        ? "rgba(245,197,24,0.05)"
                        : undefined,
                    }}
                    className="summit-db-table-row"
                  >
                    <td
                      style={{ textAlign: "center" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => toggleSelectRow(e, id)}
                        style={{
                          cursor: "pointer",
                          accentColor: "var(--s-gold-500)",
                        }}
                      />
                    </td>
                    <td className="summit-db-cell-date">{idx + 1}</td>
                    <td>
                      <div className="summit-db-cell-name">{reg.fullName}</div>
                      <div className="summit-db-cell-email">{reg.email}</div>
                      {reg.phone && (
                        <div className="summit-db-cell-email">{reg.phone}</div>
                      )}
                    </td>
                    <td>
                      <span
                        className="summit-db-tag"
                        style={{ fontFamily: "monospace" }}
                      >
                        {formatNationalId(reg.nationalId)}
                      </span>
                    </td>
                    <td>
                      <div
                        className="summit-db-cell-name"
                        style={{ marginBottom: 4 }}
                      >
                        {PROFILE_LABELS[reg.profileType] || "Legacy"}
                      </div>
                      <div
                        className="summit-db-cell-email"
                        style={{ lineHeight: 1.35 }}
                      >
                        {getProfileSummary(reg)}
                      </div>
                      <div
                        className="summit-db-cell-email"
                        style={{ marginTop: 4, textTransform: "capitalize" }}
                      >
                        {reg.governorate?.replace(/-/g, " ") || "—"}
                      </div>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: "100px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          background: statusInfo.bg,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.border}`,
                        }}
                      >
                        {workflowStatus.replace(/-/g, " ")}
                      </span>
                    </td>
                    <td>
                      {reg.primaryGoals?.length > 0 ||
                      reg.tracks?.length > 0 ? (
                        <div className="summit-db-cell-tags" style={{ gap: 6 }}>
                          {(reg.primaryGoals || []).map((g) => (
                            <span
                              key={`goal-${g}`}
                              className="summit-db-tag"
                              style={{ background: "rgba(255,255,255,0.08)" }}
                            >
                              {GOAL_LABELS[g] || toTitleText(g)}
                            </span>
                          ))}
                          {(reg.tracks || []).map((t) => (
                            <span
                              key={`track-${t}`}
                              className="summit-db-tag summit-db-tag--track"
                            >
                              {t.replace(/-/g, " ")}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="summit-db-cell-date">
                      {formatDate(reg.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {/* Bulk Action Bar (Floating) */}
        {selectedIds.size > 0 && (
          <div
            style={{
              position: "fixed",
              bottom: "24px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(13,21,41,0.95)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--s-gold-500)",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.5), 0 0 0 2px rgba(245,197,24,0.2)",
              borderRadius: "50px",
              padding: "12px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              zIndex: 100,
              color: "#fff",
            }}
          >
            <div>
              <span style={{ fontWeight: "bold", color: "var(--s-gold-400)" }}>
                {selectedIds.size}
              </span>{" "}
              selected
            </div>
            <div
              style={{
                width: "1px",
                height: "24px",
                background: "rgba(255,255,255,0.2)",
              }}
            />
            <button
              disabled={isBulkLoading}
              onClick={handleBulkExport}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "8px",
              }}
              className="summit-hover-btn"
            >
              ⬇ Export
            </button>
            {selectedIds.size === 1 && (
              <button
                disabled={isBulkLoading}
                onClick={handleDeleteSelectedOne}
                style={{
                  background: "rgba(255,107,107,0.1)",
                  border: "1px solid rgba(255,138,128,0.35)",
                  color: "#ff8a80",
                  cursor: "pointer",
                  padding: "6px 12px",
                  borderRadius: "16px",
                }}
              >
                🗑 Delete Selected
              </button>
            )}
            <button
              disabled={isBulkLoading}
              onClick={() => handleBulkUpdateStatus("verified")}
              style={{
                background: "rgba(105,240,174,0.1)",
                border: "1px solid rgba(105,240,174,0.3)",
                color: "#69f0ae",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "16px",
              }}
            >
              ✓ Mark Verified
            </button>
            <button
              disabled={isBulkLoading}
              onClick={() => handleBulkUpdateStatus("contacted")}
              style={{
                background: "rgba(79,195,247,0.1)",
                border: "1px solid rgba(79,195,247,0.3)",
                color: "#4fc3f7",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: "16px",
              }}
            >
              ✉ Mark Contacted
            </button>
            <button
              disabled={isBulkLoading}
              onClick={() => setSelectedIds(new Set())}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                marginLeft: "8px",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Registrant Drawer */}
        <RegistrantDrawer
          registrant={activeRegistrant}
          isOpen={!!activeRegistrant}
          onClose={() => setActiveRegistrant(null)}
          onDelete={async (id) => {
            await deleteRegistration(id);
            setActiveRegistrant(null);
          }}
        />
      </div>
    </div>
  );
};

RegistrantsTable.propTypes = {
  registrations: PropTypes.array.isRequired,
  filtered: PropTypes.array.isRequired,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  toggleSort: PropTypes.func.isRequired,
  deleteRegistration: PropTypes.func.isRequired,
  exportFilteredCsv: PropTypes.func.isRequired,
  hasNextPage: PropTypes.bool,
  isLoadingMore: PropTypes.bool,
  loadMore: PropTypes.func,
};

export default React.memo(RegistrantsTable);
