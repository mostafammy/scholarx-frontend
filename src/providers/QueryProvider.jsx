import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus by default (better UX for this app)
      refetchOnWindowFocus: false,
      // Don't refetch on mount by default
      refetchOnMount: false,
      // Retry failed requests once
      retry: 1,
      // Data is considered fresh for 1 minute
      staleTime: 60 * 1000,
    },
  },
});

/**
 * QueryProvider wraps the app with React Query's QueryClientProvider
 * This enables data fetching, caching, and synchronization throughout the app
 */
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Add React Query DevTools in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default QueryProvider;
