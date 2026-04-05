/**
 * @fileoverview Registration Repository — API-backed Repository Pattern implementation.
 *
 * Responsibilities:
 * - Encapsulate Summit registration API calls
 * - Normalize API response shapes for UI hooks
 * - Keep UI decoupled from transport details
 *
 * @module RegistrationRepository
 */

import axios from 'axios';
import Cookies from 'js-cookie';
import store from '../../../store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const AUTH_TOKEN_KEY = 'sx_auth';
const DEFAULT_EVENT_CODE = 'summit-2026';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * @typedef {Object} Registration
 * @property {string} id - UUID v4
 * @property {string} createdAt - ISO 8601 timestamp
 * @property {string} fullName
 * @property {string} email
 * @property {string} phone
 * @property {string} university
 * @property {string} graduationYear
 * @property {string} status
 * @property {string} fieldOfStudy
 * @property {string} governorate
 * @property {string[]} referralSources
 * @property {string[]} tracks
 * @property {string[]} workshops
 * @property {string} specialAccommodations
 */

const getAuthHeader = () => {
  const stateToken = store?.getState?.()?.auth?.token;
  const token =
    Cookies.get(AUTH_TOKEN_KEY) ||
    window.localStorage.getItem('token') ||
    window.localStorage.getItem(AUTH_TOKEN_KEY) ||
    stateToken;

  if (!token) {
    throw new Error('Admin authentication is required. Please login again.');
  }
  return { Authorization: `Bearer ${token}` };
};

const toErrorMessage = (error, fallback) => {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

/**
 * @interface IRegistrationRepository
 * @description Contract that all repository implementations must satisfy.
 */

class ApiRegistrationRepository {
  constructor(eventCode = DEFAULT_EVENT_CODE) {
    this._eventCode = eventCode;
  }

  async findAll(params = {}) {
    const now = Date.now();
    const response = await api.get('/admin/summit/registrations', {
      params: {
        _ts: now,
        eventCode: this._eventCode,
        page: 1,
        limit: 100,
        sortField: 'createdAt',
        sortDirection: 'desc',
        ...params,
      },
      headers: getAuthHeader(),
    });

    return {
      items: response.data?.data?.registrations || [],
      pagination: response.data?.data?.pagination || null,
    };
  }

  async findById(id) {
    const response = await api.get(`/admin/summit/registrations/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data?.data?.registration || null;
  }

  async emailExists(email) {
    const response = await api.get('/summit/registrations/check', {
      params: { email, eventCode: this._eventCode },
    });
    return Boolean(response.data?.data?.isRegistered);
  }

  async save(data) {
    try {
      const response = await api.post('/summit/registrations', {
        ...data,
        eventCode: this._eventCode,
      });
      return response.data?.data?.registration;
    } catch (error) {
      throw new Error(toErrorMessage(error, 'Failed to submit summit registration'));
    }
  }

  async deleteAll() {
    while (true) {
      const { items } = await this.findAll({ page: 1, limit: 100 });
      if (!items.length) {
        break;
      }

      for (const row of items) {
        await this.deleteById(row._id || row.id);
      }
    }
  }

  async getStats() {
    const now = Date.now();
    const response = await api.get('/admin/summit/dashboard/stats', {
      params: { _ts: now, eventCode: this._eventCode },
      headers: getAuthHeader(),
    });
    return (
      response.data?.data?.stats || {
        total: 0,
        todayCount: 0,
        byGovernorate: {},
        byTrack: {},
      }
    );
  }

  async updateStatus(id, status) {
    const response = await api.patch(
      `/admin/summit/registrations/${id}/status`,
      { status },
      { headers: getAuthHeader() },
    );
    return response.data?.data?.registration;
  }

  async deleteById(id) {
    await api.delete(`/admin/summit/registrations/${id}`, {
      headers: getAuthHeader(),
    });
  }

  async exportCsv(params = {}) {
    const response = await api.get('/admin/summit/registrations/export.csv', {
      params: {
        eventCode: this._eventCode,
        ...params,
      },
      headers: {
        ...getAuthHeader(),
        Accept: 'text/csv',
      },
      responseType: 'blob',
    });
    return response.data;
  }
}

/**
 * Singleton instance. Import this — do NOT instantiate directly in components.
 * Follows Dependency Inversion: components consume this interface, not the class.
 * @type {ApiRegistrationRepository}
 */
export const registrationRepository = new ApiRegistrationRepository();
