/**
 * 服务层通用类型定义
 */

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface QueryOptions {
  select?: string;
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  filters?: Record<string, any>;
  pagination?: {
    limit: number;
    offset: number;
  };
}

export interface CacheOptions {
  enabled?: boolean;
  ttl?: number; // Time to live in seconds
  key?: string;
}

export interface BatchOperation<T> {
  operation: 'insert' | 'update' | 'delete';
  data: T;
  id?: string;
}

export interface ServiceConfig {
  enableCache?: boolean;
  defaultPageSize?: number;
  maxPageSize?: number;
  enableLogging?: boolean;
}

export interface DatabaseError {
  code: string;
  message: string;
  details?: any;
  hint?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ServiceError {
  type: 'database' | 'validation' | 'authorization' | 'network' | 'unknown';
  message: string;
  details?: DatabaseError | ValidationError | any;
  code?: string;
}

export interface UserContext {
  id: string;
  email?: string;
  role?: string;
}

export interface ServiceMetrics {
  queryCount: number;
  cacheHits: number;
  cacheMisses: number;
  averageResponseTime: number;
  errorCount: number;
}
