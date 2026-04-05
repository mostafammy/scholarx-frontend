/**
 * @fileoverview useCountdown — custom hook for countdown timers.
 * Single Responsibility: ONLY manages countdown calculation and tick logic.
 * The hook re-renders on a 1-second interval and cleans up on unmount.
 *
 * @module useCountdown
 */

import { useState, useEffect, useMemo, useCallback } from 'react';

/**
 * @typedef {Object} CountdownResult
 * @property {number} days
 * @property {number} hours
 * @property {number} minutes
 * @property {number} seconds
 * @property {boolean} isExpired - true when the target date has passed
 */

/**
 * Calculates the time remaining until a target date.
 * @param {Date} targetDate
 * @returns {CountdownResult}
 */
const calculateTimeLeft = (targetDate) => {
  const diff = targetDate.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
};

/**
 * Custom hook that counts down to a target date, updating every second.
 * @param {string | Date} targetDate - ISO 8601 string or Date object
 * @returns {CountdownResult}
 *
 * @example
 * const { days, hours, minutes, seconds, isExpired } = useCountdown('2026-05-01T09:00:00+02:00');
 */
export const useCountdown = (targetDate) => {
  const parsedTarget = useMemo(
    () => (targetDate instanceof Date ? targetDate : new Date(targetDate)),
    [targetDate]
  );

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(parsedTarget));

  const tick = useCallback(() => {
    setTimeLeft(calculateTimeLeft(parsedTarget));
  }, [parsedTarget]);

  useEffect(() => {
    if (timeLeft.isExpired) return;
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [tick, timeLeft.isExpired]);

  return timeLeft;
};
