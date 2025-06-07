/**
 * 服务层统一导出
 */

// 服务类
export { PagesService } from './PagesService';
export { ProfilesService } from './ProfilesService';
export { GalleryService } from './GalleryService';
export { ShareService } from './ShareService';
export { RenderUserSyncService } from './RenderUserSyncService';

// 类型定义
export type {
  RenderPage,
  UserProfile,
  GalleryWork,
  PageWithAuthor,
  CreatePageData,
  UpdatePageData,
  PublishPageData,
  PaginationOptions,
  FilterOptions,
  GalleryFilters
} from './types/PageTypes';

export type {
  ServiceResponse,
  PaginatedResponse,
  QueryOptions,
  CacheOptions,
  BatchOperation,
  ServiceConfig,
  DatabaseError,
  ValidationError,
  ServiceError,
  UserContext,
  ServiceMetrics
} from './types/ServiceTypes';

// ProfilesService 相关类型
export type { UpdateProfileData, CreateProfileData } from './ProfilesService';

// ShareService 相关类型
export type { ShareData, ShareAccessOptions } from './ShareService';
