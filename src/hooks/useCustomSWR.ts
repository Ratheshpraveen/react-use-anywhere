import { useState, useMemo } from 'react';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';
import axios, { AxiosRequestConfig } from 'axios';
import { ErrorInterceptor, ErrorResponse } from '../utils/errorInterceptor';

// Generic type for filter and pagination
export interface DataFetchParams {
  page?: number;
  limit?: number;
  [key: string]: any;
}

// Custom hook configuration
export interface UseCustomSWRConfig<T> extends SWRConfiguration {
  initialParams?: DataFetchParams;
  axiosConfig?: AxiosRequestConfig;
}

// Custom fetcher with error handling
const customFetcher = async (url: string, params: DataFetchParams = {}, axiosConfig: AxiosRequestConfig = {}) => {
  try {
    const response = await axios.get(url, {
      ...axiosConfig,
      params: { ...params }
    });
    return response.data;
  } catch (error) {
    const processedError = ErrorInterceptor.handleError(error);
    ErrorInterceptor.logError(processedError);
    throw processedError;
  }
};

// Advanced Custom SWR Hook
export function useCustomSWR<T>(
  url: string, 
  config: UseCustomSWRConfig<T> = {}
) {
  const {
    initialParams = {},
    axiosConfig = {},
    ...swrOptions
  } = config;

  // State for dynamic params
  const [params, setParams] = useState<DataFetchParams>(initialParams);

  // Memoized fetcher to prevent unnecessary re-renders
  const memoizedFetcher = useMemo(() => 
    () => customFetcher(url, params, axiosConfig), 
    [url, params, axiosConfig]
  );

  // SWR hook with error handling
  const swr = useSWR<T, ErrorResponse>(
    url, 
    memoizedFetcher, 
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      ...swrOptions
    }
  );

  // Method to update filters and trigger re-fetch
  const updateFilters = (newFilters: DataFetchParams) => {
    setParams(prev => ({ ...prev, ...newFilters }));
  };

  // Method to reset filters
  const resetFilters = () => {
    setParams(initialParams);
  };

  return {
    ...swr,
    updateFilters,
    resetFilters,
    params
  };
}
