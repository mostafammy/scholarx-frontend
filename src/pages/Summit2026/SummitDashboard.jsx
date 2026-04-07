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
import VelocityChart from "./components/Dashboard/VelocityChart";
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
    deleteRegistration,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)', marginRight: '16px' }}>
              <span aria-hidden="true" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>🔍</span>
              <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'monospace' }}>⌘K</kbd> to search</span>
            </div>
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

          <StatsCards stats={stats} isLoading={isLoading} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', marginBottom: '24px' }}>
             <VelocityChart registrations={registrations} />
          </div>

          <VisualInsights stats={stats} registrations={registrations} />
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
            deleteRegistration={deleteRegistration}
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
