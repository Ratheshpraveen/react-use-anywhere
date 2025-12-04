import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

/**
 * Custom hook for optimized API data fetching with pagination and filtering
 * @param {string} endpoint - API endpoint URL
 * @param {Object} initialParams - Initial query parameters
 * @param {Object} options - Additional configuration options
 */
const useOptimizedDataFetch = (endpoint, initialParams = {}, options = {}) => {
  // Configuration options with defaults
  const {
    cacheDuration = 5 * 60 * 1000, // 5 minutes cache
    initialPage = 1,
    pageSize = 10,
  } = options;

  // State management
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(initialPage);
  const [params, setParams] = useState(initialParams);

  // Cache management
  const cacheRef = useRef({});
  const lastFetchTimeRef = useRef({});

  // Debounce utility
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Fetch data method
  const fetchData = useCallback(async (currentPage, currentParams, isLoadMore = false) => {
    try {
      // Check cache first
      const cacheKey = JSON.stringify({ endpoint, page: currentPage, params: currentParams });
      const now = Date.now();
      
      if (
        cacheRef.current[cacheKey] && 
        lastFetchTimeRef.current[cacheKey] && 
        now - lastFetchTimeRef.current[cacheKey] < cacheDuration
      ) {
        if (!isLoadMore) {
          setData(cacheRef.current[cacheKey]);
        }
        return cacheRef.current[cacheKey];
      }

      setLoading(true);
      setError(null);

      const response = await axios.get(endpoint, {
        params: {
          ...currentParams,
          page: currentPage,
          limit: pageSize
        }
      });

      const fetchedData = response.data;

      // Update cache
      cacheRef.current[cacheKey] = fetchedData;
      lastFetchTimeRef.current[cacheKey] = now;

      // Update state
      setData(prevData => 
        isLoadMore ? [...prevData, ...fetchedData] : fetchedData
      );

      return fetchedData;
    } catch (err) {
      setError(err);
      console.error('API Fetch Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageSize, cacheDuration]);

  // Initial data fetch
  useEffect(() => {
    fetchData(page, params);
  }, [endpoint, page, JSON.stringify(params)]);

  // Fetch more data (pagination)
  const fetchMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
    fetchData(page + 1, params, true);
  }, [page, params]);

  // Set filters with debounce
  const setFilter = useCallback(
    debounce((newParams) => {
      // Reset page when filters change
      setPage(initialPage);
      setParams(prevParams => ({
        ...prevParams,
        ...newParams
      }));
    }, 300),
    [initialPage]
  );

  // Retry mechanism
  const retry = useCallback(() => {
    setError(null);
    fetchData(page, params);
  }, [page, params]);

  return {
    data,
    loading,
    error,
    fetchMore,
    setFilter,
    retry
  };
};

export default useOptimizedDataFetch;
