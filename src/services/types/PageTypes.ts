/**
 * 页面相关的类型定义
 */

export interface RenderPage {
  id: string;
  title: string;
  description: string | null;
  html_content: string;
  code_type: string;
  status: string;
  is_protected: boolean;
  password: string | null;
  view_count: number;
  share_count: number;
  tags: string[] | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryWork {
  id: string;
  title: string;
  description: string;
  format: string;
  viewCount: number;
  shareCount: number;
  createdAt: string;
  author: string;
  thumbnail: string;
}

export interface PageWithAuthor extends RenderPage {
  author_name: string;
}

export interface CreatePageData {
  title: string;
  description?: string;
  html_content: string;
  code_type: string;
  status?: 'draft' | 'published';
  is_protected?: boolean;
  password?: string;
  tags?: string[];
}

export interface UpdatePageData {
  title?: string;
  description?: string;
  html_content?: string;
  status?: 'draft' | 'published';
  is_protected?: boolean;
  password?: string;
  tags?: string[];
}

export interface PublishPageData {
  title: string;
  description: string;
  tags: string[];
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface FilterOptions {
  status?: 'draft' | 'published';
  code_type?: string;
  search?: string;
}

export interface GalleryFilters extends FilterOptions {
  format?: string;
}
