/**
 * @fileoverview useSummitDashboard — dashboard data management hook.
 * Single Responsibility: ONLY handles reading, filtering, sorting, and
 * aggregating registration data for the admin dashboard.
 *
 * @module useSummitDashboard
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { registrationRepository } from '../services/RegistrationRepository';

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
  search: '',
  governorate: '',
  track: '',
  dateFrom: '',
  dateTo: '',
};

/**
 * Applies text search across name, email, and university fields.
 * @param {import('../services/RegistrationRepository').Registration} reg
 * @param {string} search
 * @returns {boolean}
 */
const matchesSearch = (reg, search) => {
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return (
    reg.fullName?.toLowerCase().includes(q) ||
    reg.email?.toLowerCase().includes(q) ||
    reg.university?.toLowerCase().includes(q)
  );
};

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
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const refresh = useCallback(() => {
    setRegistrations(registrationRepository.findAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const stats = useMemo(() => registrationRepository.getStats(), [registrations]);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleSort = useCallback((field) => {
    setSortDirection((prev) =>
      sortField === field ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'
    );
    setSortField(field);
  }, [sortField]);

  const filtered = useMemo(() => {
    let result = registrations.filter((reg) => {
      if (!matchesSearch(reg, filters.search)) return false;
      if (filters.governorate && reg.governorate !== filters.governorate) return false;
      if (filters.track && !reg.tracks?.includes(filters.track)) return false;
      if (filters.dateFrom && new Date(reg.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(reg.createdAt) > new Date(filters.dateTo + 'T23:59:59Z')) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';
      const cmp = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [registrations, filters, sortField, sortDirection]);

  const clearAllData = useCallback(() => {
    registrationRepository.deleteAll();
    setRegistrations([]);
  }, []);

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
    refresh,
  };
};
