import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../context/UserContext";
import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const AUTH_TOKEN_KEY = "sx_auth";

/**
 * Custom hook to check if a user has registered interest for an event
 * @param {string} eventId - The event ID to check registration status for
 * @returns {Object} - { isCheckingStatus, isRegistered, error, refetch }
 */
export default function useEventInterest(eventId) {
  const { user, loading: userLoading } = useUser();

  // Get token from Cookie (consistent with api.js)
  const token = Cookies.get(AUTH_TOKEN_KEY);

  // User ID might be _id or id depending on backend transformation
  const userId = user?._id || user?.id;

  // Fetch event interest status from the backend
  const {
    data,
    isLoading: isCheckingStatus,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["eventInterest", eventId, userId],
    queryFn: async () => {
      console.log(`[useEventInterest] Fetching status for eventId: ${eventId}`);
      console.log(
        `[useEventInterest] Token found: ${!!token} (${token ? token.substring(0, 10) + "..." : "none"})`,
      );
      console.log(`[useEventInterest] User ID: ${userId}`);

      if (!token) {
        throw new Error("No token found");
      }

      const res = await fetch(
        `${API_BASE_URL}/event-interest/status/${eventId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorMsg = body.message || `Status check failed (${res.status})`;
        console.error(`[useEventInterest] Status check failed:`, errorMsg);
        throw new Error(errorMsg);
      }

      const body = await res.json();
      console.log(`[useEventInterest] Status response:`, body);
      return body;
    },
    // Only run query if we have a token, a user ID, and an event ID
    // Also wait for user context to finish loading
    enabled: !!token && !!userId && !!eventId && !userLoading,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Listen for post-submit events to refresh specific event status
  useEffect(() => {
    const handler = (e) => {
      try {
        const { eventId: submittedId } = e.detail || {};
        if (submittedId && submittedId === eventId) {
          console.log(
            `[useEventInterest] Refreshing status after submission for eventId: ${eventId}`,
          );
          refetch();
        }
      } catch (err) {
        console.error(`[useEventInterest] Event listener error:`, err);
      }
    };
    window.addEventListener("eventRegistration:submitted", handler);
    return () =>
      window.removeEventListener("eventRegistration:submitted", handler);
  }, [eventId, refetch]);

  // Determine registration status
  const isRegistered = data?.data?.isRegistered ?? false;

  // Debug reasons for disabled query
  useEffect(() => {
    if (!token || !userId || !eventId) {
      // Only log unique reasons to avoid spam
      const reasons = [];
      if (!token) reasons.push("missing token");
      if (!userId) reasons.push("missing user ID");
      if (!eventId) reasons.push("missing event ID");
      if (userLoading) reasons.push("user loading");

      if (reasons.length > 0) {
        console.log(`[useEventInterest] Query disabled: ${reasons.join(", ")}`);
      }
    }
  }, [token, userId, eventId, userLoading]);

  return {
    isCheckingStatus: isCheckingStatus || isRefetching,
    isRegistered,
    error: error?.message || null,
    refresh: refetch,
  };
}
