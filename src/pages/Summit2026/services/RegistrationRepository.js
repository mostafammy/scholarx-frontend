/**
 * @fileoverview Registration Repository — Repository Pattern implementation.
 *
 * Applies:
 * - Repository Pattern (D in SOLID): Abstracts data persistence behind an interface.
 * - Single Responsibility: This class ONLY handles data access for registrations.
 * - Dependency Inversion: Consumers depend on the abstract interface, not localStorage directly.
 * - Open/Closed: Swap to IndexedDB or REST API by replacing this class — consumers unchanged.
 *
 * @module RegistrationRepository
 */

const STORAGE_KEY = 'summit2026_registrations';

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

/**
 * Generates a UUID v4 string without external dependencies.
 * @returns {string}
 */
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * @interface IRegistrationRepository
 * @description Contract that all repository implementations must satisfy.
 */

/**
 * LocalStorage-backed implementation of IRegistrationRepository.
 * To swap to an API, create `ApiRegistrationRepository` with the same public methods.
 */
class LocalStorageRegistrationRepository {
  /** @param {string} storageKey */
  constructor(storageKey) {
    this._key = storageKey;
  }

  /**
   * Retrieves all registrations, sorted by most recent first.
   * @returns {Registration[]}
   */
  findAll() {
    try {
      const raw = localStorage.getItem(this._key);
      const items = raw ? JSON.parse(raw) : [];
      return [...items].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } catch {
      console.error('[RegistrationRepository] Failed to parse stored data.');
      return [];
    }
  }

  /**
   * Finds a registration by its unique ID.
   * @param {string} id
   * @returns {Registration | undefined}
   */
  findById(id) {
    return this.findAll().find((r) => r.id === id);
  }

  /**
   * Checks if an email address is already registered.
   * @param {string} email
   * @returns {boolean}
   */
  emailExists(email) {
    return this.findAll().some(
      (r) => r.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Persists a new registration. Throws if email is already registered.
   * @param {Omit<Registration, 'id' | 'createdAt'>} data
   * @returns {Registration} The persisted registration with generated id and timestamp.
   * @throws {Error} If the email is already registered.
   */
  save(data) {
    if (this.emailExists(data.email)) {
      throw new Error(`Email "${data.email}" is already registered.`);
    }

    const registration = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    const existing = this.findAll();
    localStorage.setItem(
      this._key,
      JSON.stringify([...existing, registration])
    );
    return registration;
  }

  /**
   * Deletes all registrations after confirmation.
   * @returns {void}
   */
  deleteAll() {
    localStorage.removeItem(this._key);
  }

  /**
   * Returns aggregate statistics for the dashboard.
   * @returns {{ total: number, todayCount: number, byGovernorate: Record<string, number>, byTrack: Record<string, number> }}
   */
  getStats() {
    const all = this.findAll();
    const today = new Date().toDateString();

    const todayCount = all.filter(
      (r) => new Date(r.createdAt).toDateString() === today
    ).length;

    const byGovernorate = all.reduce((acc, r) => {
      const key = r.governorate || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const byTrack = all.reduce((acc, r) => {
      (r.tracks || []).forEach((track) => {
        acc[track] = (acc[track] || 0) + 1;
      });
      return acc;
    }, {});

    return { total: all.length, todayCount, byGovernorate, byTrack };
  }
}

/**
 * Singleton instance. Import this — do NOT instantiate directly in components.
 * Follows Dependency Inversion: components consume this interface, not the class.
 * @type {LocalStorageRegistrationRepository}
 */
export const registrationRepository = new LocalStorageRegistrationRepository(
  STORAGE_KEY
);
