import { useMemo } from 'react';

export const useFilteredData = (data, searchTerm, filterFn) => {
  return useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(filterFn);
  }, [data, searchTerm, filterFn]);
};

export const useSortedData = (data, sortConfig) => {
  return useMemo(() => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);
};