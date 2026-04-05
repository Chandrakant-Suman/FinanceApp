import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (fetchFn, deps = [], { immediate = true } = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFn(...args);
      if (isMounted.current) setData(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.';
      if (isMounted.current) setError(msg);
      throw err;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

export default useFetch;
