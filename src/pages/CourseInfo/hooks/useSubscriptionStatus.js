/**
 * useSubscriptionStatus Hook
 * Manages subscription status checking
 * Following Single Responsibility Principle
 */

import { useState, useEffect, useCallback } from "react";
import api from "../../../services/api";
import { useUser } from "../../../context/UserContext";

/**
 * Custom hook for checking user subscription status
 * @param {string} courseId - The course ID to check subscription for
 * @returns {Object} Subscription status and loading state
 */
export const useSubscriptionStatus = (courseId) => {
  const { user } = useUser();
  const [state, setState] = useState({
    isLoading: false,
    isSubscribed: false,
    error: null,
  });

  const checkSubscription = useCallback(async () => {
    // Early return if no user or courseId
    if (!user?._id || !courseId) {
      setState((prev) => ({ ...prev, isSubscribed: false }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get(
        `/courses/${courseId}/subscription-status`,
        { params: { userId: user._id } }
      );

      setState({
        isLoading: false,
        isSubscribed: Boolean(response.data?.data?.isSubscribed),
        error: null,
      });
    } catch (error) {
      setState({
        isLoading: false,
        isSubscribed: false,
        error: error.message || "Failed to check subscription status",
      });
    }
  }, [user?._id, courseId]);

  // Check subscription on mount and when dependencies change
  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      if (!isMounted) return;
      await checkSubscription();
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [checkSubscription]);

  // Refetch function for manual refresh
  const refetch = useCallback(() => {
    checkSubscription();
  }, [checkSubscription]);

  return {
    ...state,
    refetch,
  };
};

export default useSubscriptionStatus;
