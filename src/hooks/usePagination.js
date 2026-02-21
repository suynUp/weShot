// hooks/usePagination.js
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

export function usePagination({ 
  itemsPerPage = 9,
  initialPage = 1,
  fetchData,
  dependencies = [],
  total: externalTotal,
  onTotalChange,
} = {}) {
  // 检查是否提供了 fetchData
  if (!fetchData) {
    console.warn('usePagination: fetchData is required for API mode');
  }

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [internalTotal, setInternalTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const prevDepsRef = useRef(dependencies);
  const prevPageRef = useRef(initialPage);
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);
  const prevTotalRef = useRef(externalTotal);

  // 使用外部传入的 total，如果没有则使用 internalTotal
  const total = useMemo(() => {
    return Math.max(0, externalTotal !== undefined ? externalTotal : internalTotal);
  }, [externalTotal, internalTotal]);

  // 计算总页数
  const totalPages = useMemo(() => {
    if (total <= 0) return 0;
    return Math.ceil(total / itemsPerPage);
  }, [total, itemsPerPage]);

  // 监听外部 total 变化，如果当前页超出总页数，自动调整
  useEffect(() => {
    if (prevTotalRef.current !== externalTotal) {
      prevTotalRef.current = externalTotal;

      if (totalPages === 0) {
        setCurrentPage(initialPage);
      } else if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    }
  }, [externalTotal, totalPages, currentPage, initialPage]);

  const updateTotal = useCallback((newTotal) => {
    const validTotal = Math.max(0, newTotal);
    if (externalTotal === undefined) {
      setInternalTotal(validTotal);
    }
    if (onTotalChange) {
      onTotalChange(validTotal);
    }
  }, [externalTotal, onTotalChange]);

  const loadData = useCallback(async (page) => {
    if (!fetchData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading data for page:', page);
      const result = await fetchData(page, itemsPerPage);
      
      if (!isMounted.current) return;
      
      if (result && typeof result.total === 'number') {
        updateTotal(result.total);
      }
      
    } catch (err) {
      if (isMounted.current) {
        setError(err.message || 'Failed to load data');
        updateTotal(0);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [fetchData, itemsPerPage, updateTotal]);

  const handlePageChange = useCallback((page) => {
    if (totalPages === 0) {
      setCurrentPage(initialPage);
      return;
    }
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages, initialPage]);

  // 使用 useCallback 缓存 haveDependenciesChanged 函数
  const haveDependenciesChanged = useCallback(() => {
    const prevDeps = prevDepsRef.current;
    if (prevDeps.length !== dependencies.length) return true;
    
    return dependencies.some((dep, index) => dep !== prevDeps[index]);
  }, [dependencies]);

  useEffect(() => {
    isMounted.current = true;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  // 修改这里：当页码变化或依赖变化时加载数据
  useEffect(() => {
    if (!fetchData) return;

    const depsChanged = haveDependenciesChanged();
    const pageChanged = prevPageRef.current !== currentPage;
    
    console.log('Effect triggered:', {
      currentPage,
      prevPage: prevPageRef.current,
      depsChanged,
      pageChanged,
      initialLoadDone: initialLoadDone.current
    });

    if (!initialLoadDone.current || depsChanged || pageChanged) {
      console.log('Loading data for page', currentPage);
      loadData(currentPage);
      
      initialLoadDone.current = true;
      prevDepsRef.current = dependencies;
      prevPageRef.current = currentPage;
    }
  }, [currentPage, dependencies, fetchData, loadData, haveDependenciesChanged]);

  // 当依赖变化时，重置到第一页
  useEffect(() => {
    if (fetchData && initialLoadDone.current && haveDependenciesChanged()) {
      console.log('Dependencies changed, resetting to initial page:', initialPage);
      setCurrentPage(initialPage);
    }
  }, [dependencies, fetchData, haveDependenciesChanged, initialPage]);

  const resetPagination = useCallback(() => {
    console.log('Resetting pagination');
    setCurrentPage(initialPage);
    if (externalTotal === undefined) {
      setInternalTotal(0);
    }
    setError(null);
    initialLoadDone.current = false;
    prevPageRef.current = initialPage;
  }, [initialPage, externalTotal]);

  const reloadCurrentPage = useCallback(() => {
    if (fetchData) {
      console.log('Reloading current page:', currentPage);
      loadData(currentPage);
    }
  }, [fetchData, currentPage, loadData]);

  const setTotal = useCallback((newTotal) => {
    const validTotal = Math.max(0, newTotal);
    if (externalTotal === undefined) {
      setInternalTotal(validTotal);
    } else if (onTotalChange) {
      onTotalChange(validTotal);
    }
  }, [externalTotal, onTotalChange]);

  return {
    currentPage,
    totalPages,
    total,
    loading,
    error,
    setCurrentPage: handlePageChange,
    resetPagination,
    reloadCurrentPage,
    setTotal,
  };
}