/**
 * @fileoverview useSummitDashboard — dashboard data management hook.
 * Single Responsibility: ONLY handles reading, filtering, sorting, and
 * aggregating registration data for the admin dashboard.
 *
 * @module useSummitDashboard
 */

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { registrationRepository } from "../services/RegistrationRepository";

/**
 * @typedef {Object} DashboardFilters
 * @property {string} search - Text search across name/email/university
 * @property {string} governorate - Filter by governorate value
 * @property {string} track - Filter by track id
 * @property {string} dateFrom - ISO date string lower bound
 * @property {string} dateTo - ISO date string upper bound
 */

/**
 * @typedef {'createdAt' | 'fullName' | 'governorate'} SortField
 * @typedef {'asc' | 'desc'} SortDirection
 */

const DEFAULT_FILTERS = {
  search: "",
  governorate: "",
  track: "",
  dateFrom: "",
  dateTo: "",
};

const DASHBOARD_PAGE_LIMIT = 100;

/**
 * Custom hook for the summit admin dashboard.
 * @returns {{
 *   registrations: import('../services/RegistrationRepository').Registration[],
 *   filtered: import('../services/RegistrationRepository').Registration[],
 *   stats: ReturnType<import('../services/RegistrationRepository').LocalStorageRegistrationRepository['getStats']>,
 *   filters: DashboardFilters,
 *   setFilter: (key: keyof DashboardFilters, value: string) => void,
 *   resetFilters: () => void,
 *   sortField: SortField,
 *   sortDirection: SortDirection,
 *   toggleSort: (field: SortField) => void,
 *   clearAllData: () => void,
 *   refresh: () => void,
 * }}
 */
export const useSummitDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    todayCount: 0,
    byGovernorate: {},
    byTrack: {},
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const isRefreshingRef = useRef(false);

  const toDashboardError = useCallback((error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      return "Session expired or unauthorized. Please login again as admin.";
    }

    return (
      error?.response?.data?.message ||
      error?.message ||
      "Failed to fetch dashboard data."
    );
  }, []);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;
    setIsLoading(true);
    try {
      const [listResult, statsResult] = await Promise.all([
        registrationRepository.findAll({
          page: 1,
          limit: DASHBOARD_PAGE_LIMIT,
          search: filters.search || undefined,
          governorate: filters.governorate || undefined,
          track: filters.track || undefined,
          dateFrom: filters.dateFrom || undefined,
          dateTo: filters.dateTo || undefined,
          sortField,
          sortDirection,
        }),
        registrationRepository.getStats(),
      ]);

      setRegistrations(listResult.items || []);
      setStats(statsResult);
      setErrorMessage("");
      setLastUpdatedAt(new Date());
    } catch (error) {
      console.error("Failed to fetch summit dashboard data:", error);
      setErrorMessage(toDashboardError(error));
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, [filters, sortField, sortDirection, toDashboardError]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      refresh();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [refresh]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [refresh]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleSort = useCallback(
    (field) => {
      setSortDirection((prev) =>
        sortField === field ? (prev === "asc" ? "desc" : "asc") : "desc",
      );
      setSortField(field);
    },
    [sortField],
  );

  const filtered = useMemo(() => registrations, [registrations]);

  const clearAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      await registrationRepository.deleteAll();
      await refresh();
    } finally {
      setIsLoading(false);
    }
  }, [refresh]);

  const exportFilteredCsv = useCallback(async () => {
    const blob = await registrationRepository.exportCsv({
      search: filters.search || undefined,
      governorate: filters.governorate || undefined,
      track: filters.track || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
    });

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `summit-registrations-${Date.now()}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }, [filters]);

  return {
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
    refresh,
    isLoading,
    errorMessage,
    lastUpdatedAt,
  };
};
