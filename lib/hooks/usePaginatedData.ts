import { useState, useEffect, useCallback, useMemo } from 'react';

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface FilterOptions {
  [key: string]: string | number | boolean;
}

export interface UsePaginatedDataResult<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  fetchData: (options?: { page?: number; filters?: FilterOptions }) => Promise<void>;
}

export function usePaginatedData<T>(
  fetchFunction: (options: { page: number; pageSize: number; filters?: FilterOptions }) => Promise<{ 
    data: T[]; 
    total: number; 
  }>,
  initialOptions: {
    initialPage?: number;
    pageSize?: number;
    initialFilters?: FilterOptions;
  } = {}
): UsePaginatedDataResult<T> {
  const {
    initialPage = 1,
    pageSize = 10,
    initialFilters = {}
  } = initialOptions;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [totalItems, setTotalItems] = useState<number>(0);

  const totalPages = useMemo(() => 
    Math.ceil(totalItems / pageSize), 
    [totalItems, pageSize]
  );

  const hasNextPage = useMemo(() => 
    currentPage < totalPages, 
    [currentPage, totalPages]
  );

  const hasPreviousPage = useMemo(() => 
    currentPage > 1, 
    [currentPage]
  );

  const fetchData = useCallback(async (options: { 
    page?: number; 
    filters?: FilterOptions 
  } = {}) => {
    const pageToFetch = options.page ?? currentPage;
    const filtersToUse = { ...filters, ...options.filters };

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction({
        page: pageToFetch,
        pageSize,
        filters: filtersToUse
      });

      setData(result.data);
      setTotalItems(result.total);
      setCurrentPage(pageToFetch);
      
      if (options.filters) {
        setFilters(filtersToUse);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, pageSize, currentPage, filters]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    loading,
    error,
    totalItems,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    fetchData
  };
}
