import useSWR from 'swr';
import { fetcher } from '../utils/fetcher';

/**
 * Custom hook for flexible SWR data fetching
 * @param {string} url - The URL to fetch data from
 * @param {Object} [options] - SWR and fetcher options
 * @returns {Object} SWR response object
 */
export const useSWRFetch = (url, options = {}) => {
  const {
    // SWR specific options
    revalidateOnFocus = true,
    revalidateOnReconnect = true,
    refreshInterval = 0,
    dedupingInterval = 2000,
    
    // Fetcher options
    fetcherOptions = {},
    
    // Fallback data
    fallbackData,
  } = options;

  const swrOptions = {
    fetcher: (fetchUrl) => fetcher(fetchUrl, fetcherOptions),
    revalidateOnFocus,
    revalidateOnReconnect,
    refreshInterval,
    dedupingInterval,
    fallbackData,
  };

  const { data, error, isLoading, mutate } = useSWR(url, swrOptions);

  return {
    data,
    error,
    isLoading,
    mutate,
    isError: error !== undefined,
  };
};

export default useSWRFetch;
