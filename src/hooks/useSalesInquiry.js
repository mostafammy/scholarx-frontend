import { useQuery } from "@tanstack/react-query";
import { salesInquiryService, authService } from "../services/api";

const STALE_5_MIN = 5 * 60 * 1000;

/**
 * useSalesInquiry
 *
 * Checks whether the currently authenticated user has already submitted a
 * sales inquiry for the given course.  The query is only enabled when:
 *   - courseId is truthy
 *   - the user is authenticated
 *   - the `enabled` option is true (defaults to true)
 *
 * @param {string} courseId
 * @param {{ enabled?: boolean }} options
 */
const useSalesInquiry = (courseId, options = {}) => {
  const { enabled = true } = options;
  const isAuth = authService.isAuthenticated();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["salesInquiry", courseId],
    queryFn: () => salesInquiryService.checkInquiryStatus(courseId),
    enabled: Boolean(courseId) && enabled && isAuth,
    staleTime: STALE_5_MIN,
    retry: false,
  });

  return {
    hasInquiry: data?.hasInquiry ?? false,
    inquiry: data?.inquiry ?? null,
    isStatusLoading: isLoading,
    statusError: error,
    refetchStatus: refetch,
  };
};

export default useSalesInquiry;
