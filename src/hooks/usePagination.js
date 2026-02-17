// hooks/usePagination.js
import { useState, useMemo, useCallback, useEffect } from 'react';

export function usePagination({ 
  data = [], 
  itemsPerPage = 9,
  initialPage = 1,
  fetchData, // fetchData(pageNum, pageSize) 应该返回 { data: { list: [], total: number } }
  dependencies = [] // 依赖项，变化时重新获取数据
} = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [paginatedData, setPaginatedData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 计算总页数
  const totalPages = useMemo(() => 
    Math.ceil(total / itemsPerPage), 
    [total, itemsPerPage]
  );

  // 获取数据的函数
  const loadData = useCallback(async (page) => {
    if (!fetchData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchData(page, itemsPerPage);
      
      // 处理返回格式：{ data: { list: [], total: number } }
      if (result?.data) {
        if (Array.isArray(result.data.list)) {
          setPaginatedData(result.data.list);
          setTotal(result.data.total || result.data.list.length);
        } else {
          console.warn('Unexpected data format: list is not an array', result.data);
          setPaginatedData([]);
          setTotal(0);
        }
      } 
    } catch (err) {
      setError(err.message || 'Failed to load data');
      setPaginatedData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [fetchData, itemsPerPage]);

  // 首次加载或依赖变化时加载数据
  useEffect(() => {
    if (fetchData) {
      loadData(currentPage);
    }
  }, [currentPage, ...dependencies]);

  // 处理数据变化（当传入data且没有fetchData时使用同步数据）
  useEffect(() => {
    if (!fetchData && data.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedData(data.slice(startIndex, endIndex));
      setTotal(data.length);
    }
  }, [data, currentPage, itemsPerPage, fetchData]);

  return {
    // 状态
    currentPage,
    totalPages,
    total,
    paginatedData,
    loading,
    error,
    
    // 方法
    setCurrentPage,
  };
}