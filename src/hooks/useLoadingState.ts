import { useState, useCallback } from 'react';
import { TIMING } from '@/constants/ui';
import { formatErrorMessage } from '@/utils/ui-helpers';

interface LoadingState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

interface UseLoadingStateOptions {
  initialLoading?: boolean;
  minLoadingTime?: number;
}

export const useLoadingState = <T = unknown>(options: UseLoadingStateOptions = {}) => {
  const { 
    initialLoading = false, 
    minLoadingTime = TIMING.MIN_LOADING_TIME 
  } = options;
  
  const [state, setState] = useState<LoadingState<T>>({
    loading: initialLoading,
    error: null,
    data: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null, loading: false }));
  }, []);

  const execute = useCallback(async (
    asyncFn: () => Promise<T>,
    options: { onSuccess?: (data: T) => void; onError?: (error: Error) => void } = {}
  ) => {
    const startTime = Date.now();
    setLoading(true);

    try {
      const result = await asyncFn();
      
      // 确保最小加载时间
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsed);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = formatErrorMessage(error, '操作失败');
      setError(errorMessage);
      options.onError?.(error instanceof Error ? error : new Error(errorMessage));
      throw error;
    }
  }, [setLoading, setData, setError, minLoadingTime]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    execute,
    reset,
  };
}; 