import React, { useState, useCallback } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { salesInquiryService } from "../../services/api";
import { useUser } from "../../context/UserContext";
import StatsCards from "./components/StatsCards/StatsCards";
import InquiriesTable from "./components/InquiriesTable/InquiriesTable";
import InquiryDetailDrawer from "./components/InquiryDetailDrawer/InquiryDetailDrawer";
import styles from "./SalesDashboard.module.css";
import { FiRefreshCw, FiAlertCircle, FiLock } from "react-icons/fi";

const STATS_STALE = 60_000; // 1 minute
const LIST_STALE = 30_000; // 30 seconds

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

/**
 * SalesDashboard
 *
 * Protected page for users with role "sales" or "admin".
 * Displays summary stats, a filterable paginated table of inquiries,
 * and a slide-in detail drawer for CRM actions.
 */
const SalesDashboard = () => {
  const { user } = useUser();

  // Filter + pagination state
  const [activeStatus, setActiveStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Detail drawer
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // ── Stats ────────────────────────────────
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
    isRefetching: isStatsRefetching,
  } = useQuery({
    queryKey: ["salesStats"],
    queryFn: salesInquiryService.getDashboardStats,
    staleTime: STATS_STALE,
    refetchOnWindowFocus: true, // re-fetch when user returns to tab
  });

  // ── Inquiries list ───────────────────────
  const {
    data: listData,
    isLoading: listLoading,
    error: listError,
    refetch: refetchList,
    isRefetching: isListRefetching,
  } = useQuery({
    queryKey: ["salesInquiries", activeStatus, currentPage],
    queryFn: () =>
      salesInquiryService.listInquiries({
        ...(activeStatus ? { status: activeStatus } : {}),
        page: currentPage,
        limit: 20,
      }),
    staleTime: LIST_STALE,
    placeholderData: keepPreviousData,
  });

  const handleStatusChange = useCallback((status) => {
    setActiveStatus(status);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleRefresh = useCallback(() => {
    refetchStats();
    refetchList();
  }, [refetchStats, refetchList]);

  const handleDrawerUpdated = useCallback(() => {
    refetchStats();
    refetchList();
    setSelectedInquiry(null);
  }, [refetchStats, refetchList]);

  const isRefreshing = isStatsRefetching || isListRefetching;

  // ── Access guard ────────────────────────
  if (user && user.role !== "sales" && user.role !== "admin") {
    return (
      <div className={styles.page}>
        <motion.div
          className={styles.accessDenied}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className={styles.accessIcon}>
            <FiLock color="#94a3b8" />
          </div>
          <h2>Access Restricted</h2>
          <p>
            This dashboard is exclusively available to sales team members and
            administrators.
          </p>
        </motion.div>
      </div>
    );
  }

  const stats = statsData?.stats || null;
  const items = listData?.items || [];
  const pagination = listData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  };

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ── Page header ── */}
        <motion.div className={styles.pageHeader} variants={itemVariants}>
          <div className={styles.titleWrapper}>
            <h1 className={styles.pageTitle}>Sales Intelligence</h1>
            <p className={styles.pageSubtitle}>
              Monitor, engage, and convert course inquiries effortlessly.
            </p>
          </div>
          <motion.button
            className={styles.refreshBtn}
            onClick={handleRefresh}
            disabled={statsLoading || listLoading || isRefreshing}
            aria-label="Refresh dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className={styles.refreshIcon}
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{
                repeat: isRefreshing ? Infinity : 0,
                duration: 1,
                ease: "linear",
              }}
            >
              <FiRefreshCw />
            </motion.div>
            {isRefreshing ? "Syncing..." : "Refresh"}
          </motion.button>
        </motion.div>

        {/* ── Error banners ── */}
        <AnimatePresence>
          {statsError && (
            <motion.div
              className={styles.errorBanner}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FiAlertCircle size={20} /> Could not sync metrics:{" "}
              {statsError.message || "Connection error"}
            </motion.div>
          )}

          {listError && (
            <motion.div
              className={styles.errorBanner}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <FiAlertCircle size={20} /> Could not load pipeline:{" "}
              {listError.message || "Connection error"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stats row ── */}
        <motion.div variants={itemVariants}>
          <StatsCards stats={stats} isLoading={statsLoading} />
        </motion.div>

        {/* ── Inquiries table ── */}
        <motion.div variants={itemVariants}>
          <InquiriesTable
            items={items}
            pagination={pagination}
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
            onViewInquiry={setSelectedInquiry}
            isLoading={listLoading}
            stats={stats}
          />
        </motion.div>
      </motion.div>

      {/* ── Detail drawer ── */}
      <InquiryDetailDrawer
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onUpdated={handleDrawerUpdated}
      />
    </div>
  );
};

export default SalesDashboard;
