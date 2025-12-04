import useSWR from 'swr';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { useState } from 'react';

// Global error handler
const globalErrorHandler = (error: AxiosError) => {
  // Centralized error handling logic
  console.error('Global Error Handler:', error);
  
  // You can add more sophisticated error handling here
  // For example:
  // - Log to error tracking service
  // - Show user-friendly error notifications
  // - Handle specific error types (401, 403, 500, etc.)
  
  throw error; // Re-throw to allow component-level error handling
};

// Fetcher function with interceptor and error handling
const fetcher = async (url: string, config: AxiosRequestConfig = {}) => {
  try {
    // Add global request interceptor
    axios.interceptors.request.use(
      (requestConfig) => {
        // You can add global request modifications here
        // For example, adding authentication tokens
        // requestConfig.headers['Authorization'] = `Bearer ${getToken()}`;
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Add global response interceptor
    axios.interceptors.response.use(
      (response) => response,
      globalErrorHandler
    );

    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    globalErrorHandler(error as AxiosError);
  }
};

// Custom hook for data fetching with advanced features
export const useDataFetcher = <T = any>(
  url: string, 
  initialFilters: Record<string, any> = {}, 
  options: {
    pageSize?: number;
    initialPage?: number;
  } = {}
) => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(options.initialPage || 1);
  const pageSize = options.pageSize || 10;

  // Construct query parameters
  const queryParams = new URLSearchParams({
    ...filters,
    page: page.toString(),
    pageSize: pageSize.toString()
  });

  // Combine URL with query parameters
  const fullUrl = `${url}?${queryParams}`;

  // Use SWR for data fetching with advanced configuration
  const { 
    data, 
    error, 
    isLoading, 
    mutate 
  } = useSWR<T>(fullUrl, fetcher, {
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateIfStale: true,  // Revalidate stale data
    revalidateOnReconnect: true, // Revalidate when reconnecting
    shouldRetryOnError: true, // Retry on error
    errorRetryInterval: 5000, // Retry every 5 seconds
    errorRetryCount: 3,       // Maximum 3 retries
  });

  // Method to update filters and trigger revalidation
  const updateFilters = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Method to change page
  const changePage = (newPage: number) => {
    setPage(newPage);
  };

  return {
    data,
    error,
    isLoading,
    filters,
    page,
    pageSize,
    updateFilters,
    changePage,
    mutate // Allow manual revalidation if needed
  };
};

// Optional: Export a utility for manual data fetching if needed
export const fetchData = async <T = any>(
  url: string, 
  config?: AxiosRequestConfig
): Promise<T> => {
  return fetcher(url, config);
};
