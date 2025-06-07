import { TIMING } from '@/constants/ui';

/**
 * 创建带有延迟的导航函数，提供视觉反馈
 * @param navigate - React Router 导航函数
 * @param setNavigating - 设置导航状态的函数
 * @param delay - 延迟时间，默认使用 TIMING.NAVIGATION_DELAY
 */
export const createDelayedNavigation = (
  navigate: (path: string) => void,
  setNavigating: (navigating: boolean) => void,
  delay: number = TIMING.NAVIGATION_DELAY
) => {
  return (path: string) => {
    setNavigating(true);
    setTimeout(() => {
      navigate(path);
      setNavigating(false);
    }, delay);
  };
};

/**
 * 创建异步操作的最小执行时间包装器
 * @param asyncFn - 异步函数
 * @param minTime - 最小执行时间
 */
export const withMinExecutionTime = async <T>(
  asyncFn: () => Promise<T>,
  minTime: number = TIMING.MIN_LOADING_TIME
): Promise<T> => {
  const startTime = Date.now();
  const result = await asyncFn();
  
  const elapsed = Date.now() - startTime;
  const remainingTime = Math.max(0, minTime - elapsed);
  
  if (remainingTime > 0) {
    await new Promise(resolve => setTimeout(resolve, remainingTime));
  }
  
  return result;
};

/**
 * 格式化错误消息
 * @param error - 错误对象或字符串
 * @param defaultMessage - 默认错误消息
 */
export const formatErrorMessage = (
  error: unknown,
  defaultMessage: string = '操作失败'
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
};

/**
 * 生成骨架屏数组
 * @param count - 骨架屏数量
 * @param startIndex - 起始索引
 */
export const generateSkeletonArray = (count: number, startIndex: number = 1): number[] => {
  return Array.from({ length: count }, (_, index) => startIndex + index);
};

/**
 * 限制数字在指定范围内
 * @param value - 要限制的值
 * @param min - 最小值
 * @param max - 最大值
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * 格式化文件大小
 * @param bytes - 字节数
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 格式化日期为相对时间
 * @param date - 日期字符串或Date对象
 */
export const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return '今天';
  if (diffInDays === 1) return '昨天';
  if (diffInDays < 7) return `${diffInDays}天前`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}周前`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}个月前`;
  
  return `${Math.floor(diffInDays / 365)}年前`;
};

/**
 * 防抖函数
 * @param func - 要防抖的函数
 * @param delay - 延迟时间
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * 节流函数
 * @param func - 要节流的函数
 * @param delay - 延迟时间
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let isThrottled = false;
  
  return (...args: Parameters<T>) => {
    if (isThrottled) return;
    
    func(...args);
    isThrottled = true;
    
    setTimeout(() => {
      isThrottled = false;
    }, delay);
  };
};

/**
 * 生成唯一ID
 * @param prefix - ID前缀
 */
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 检查字符串是否为空或只包含空白字符
 * @param str - 要检查的字符串
 */
export const isEmptyOrWhitespace = (str: string | null | undefined): boolean => {
  return !str || str.trim().length === 0;
};

/**
 * 安全地解析JSON
 * @param jsonString - JSON字符串
 * @param defaultValue - 解析失败时的默认值
 */
export const safeJsonParse = <T>(jsonString: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
};

/**
 * 复制文本到剪贴板
 * @param text - 要复制的文本
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 降级到传统方法
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}; 