/**
 * @fileoverview SummitDashboard — Admin dashboard root page.
 * Composition root for all dashboard sub-components.
 * Protected by AdminRoute in App.jsx.
 */

import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useSummitDashboard } from "./hooks/useSummitDashboard";
import StatsCards from "./components/Dashboard/StatsCards";
import VisualInsights from "./components/Dashboard/VisualInsights";
import FilterBar from "./components/Dashboard/FilterBar";
import RegistrantsTable from "./components/Dashboard/RegistrantsTable";
import "./SummitDashboard.css";

const SummitDashboard = () => {
  const {
    registrations,
    filtered,
    stats,
    filters,
    setFilter,
    resetFilters,
    sortField,
    sortDirection,
    toggleSort,
    clearAllData,
    exportFilteredCsv,
    loadMore,
    hasNextPage,
    isLoadingMore,
    refresh,
    isLoading,
    errorMessage,
    lastUpdatedAt,
  } = useSummitDashboard();

  return (
    <>
      <Helmet>
        <title>Registration Dashboard | Next Scholar Summit 2026</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="summit-dashboard">
        {/* Header */}
        <header className="summit-db-header" role="banner">
          <div className="summit-db-header-left">
            <div className="summit-db-logo-badge" aria-hidden="true">
              🏆
            </div>
            <div>
              <div className="summit-db-header-title">
                Summit 2026 — Admin Dashboard
              </div>
              <div className="summit-db-header-subtitle">
                Registration management &amp; analytics
              </div>
            </div>
          </div>
          <div className="summit-db-header-right">
            <button
              type="button"
              id="db-refresh-btn"
              className="summit-db-refresh-btn"
              onClick={refresh}
              aria-label="Refresh data"
              disabled={isLoading}
            >
              {isLoading ? "↻ Refreshing..." : "↻ Refresh"}
            </button>
            <Link
              to="/summit-2026"
              id="db-back-to-summit-link"
              className="summit-db-back-link"
              aria-label="Back to summit page"
            >
              ← Summit Page
            </Link>
          </div>
        </header>

        {/* Body */}
        <main className="summit-db-body" id="dashboard-main">
          <div className="summit-db-live-meta" role="status" aria-live="polite">
            <span className="summit-db-live-dot" aria-hidden="true" />
            <span>
              {lastUpdatedAt
                ? `Live data - Last update: ${lastUpdatedAt.toLocaleTimeString()}`
                : "Live data - Waiting for first successful fetch"}
            </span>
          </div>

          {errorMessage && (
            <div className="summit-db-error" role="alert">
              {errorMessage}
            </div>
          )}

          <VisualInsights stats={stats} registrations={registrations} />
          <StatsCards stats={stats} />
          <FilterBar
            filters={filters}
            setFilter={setFilter}
            resetFilters={resetFilters}
          />
          <RegistrantsTable
            registrations={registrations}
            filtered={filtered}
            sortField={sortField}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            clearAllData={clearAllData}
            exportFilteredCsv={exportFilteredCsv}
            loadMore={loadMore}
            hasNextPage={hasNextPage}
            isLoadingMore={isLoadingMore}
            refresh={refresh}
          />
        </main>
      </div>
    </>
  );
};

export default SummitDashboard;
