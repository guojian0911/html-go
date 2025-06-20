/**
 * 画廊展示相关的优化服务
 * 专门处理画廊页面的数据获取和性能优化
 */

import { supabase } from '@/integrations/supabase/client';
import type { GalleryWork, GalleryFilters, PaginationOptions } from './types/PageTypes';
import type { ServiceResponse, PaginatedResponse } from './types/ServiceTypes';

export class GalleryService {
  /**
   * 获取已发布的作品列表（优化版本）
   * 使用JOIN查询避免N+1问题，支持分页和过滤
   */
  static async getPublishedWorks(
    options: GalleryFilters & PaginationOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<GalleryWork>>> {
    try {
      const { 
        format, 
        search,
        limit = 20, 
        offset = 0 
      } = options;

      // 构建优化的查询
      let query = supabase
        .from('render_pages')
        .select(`
          id,
          title,
          description,
          code_type,
          view_count,
          share_count,
          created_at,
          render_profiles!inner(display_name)
        `, { count: 'exact' })
        .eq('status', 'published');

      // 应用过滤条件
      if (format && format !== 'all') {
        query = query.eq('code_type', format);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // 排序和分页
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return {
          success: false,
          error: `获取作品列表失败: ${error.message}`
        };
      }

      // 转换数据格式
      const formattedWorks: GalleryWork[] = (data || []).map(page => ({
        id: page.id,
        title: page.title,
        description: page.description || '',
        format: page.code_type,
        viewCount: page.view_count,
        shareCount: page.share_count,
        createdAt: page.created_at,
        author: (page.render_profiles as unknown as { display_name: string })?.display_name || '匿名用户',
        thumbnail: this.generateThumbnail(page.code_type)
      }));

      return {
        success: true,
        data: {
          data: formattedWorks,
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasMore: (count || 0) > offset + limit
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `获取作品列表时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 获取热门作品（按浏览量排序）
   */
  static async getPopularWorks(
    limit: number = 10
  ): Promise<ServiceResponse<GalleryWork[]>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .select(`
          id,
          title,
          description,
          code_type,
          view_count,
          share_count,
          created_at,
          render_profiles!inner(display_name)
        `)
        .eq('status', 'published')
        .order('view_count', { ascending: false })
        .limit(limit);

      if (error) {
        return {
          success: false,
          error: `获取热门作品失败: ${error.message}`
        };
      }

      const formattedWorks: GalleryWork[] = (data || []).map(page => ({
        id: page.id,
        title: page.title,
        description: page.description || '',
        format: page.code_type,
        viewCount: page.view_count,
        shareCount: page.share_count,
        createdAt: page.created_at,
        author: (page.render_profiles as unknown as { display_name: string })?.display_name || '匿名用户',
        thumbnail: this.generateThumbnail(page.code_type)
      }));

      return {
        success: true,
        data: formattedWorks
      };
    } catch (error) {
      return {
        success: false,
        error: `获取热门作品时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 获取最新作品
   */
  static async getLatestWorks(
    limit: number = 10
  ): Promise<ServiceResponse<GalleryWork[]>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .select(`
          id,
          title,
          description,
          code_type,
          view_count,
          share_count,
          created_at,
          render_profiles!inner(display_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return {
          success: false,
          error: `获取最新作品失败: ${error.message}`
        };
      }

      const formattedWorks: GalleryWork[] = (data || []).map(page => ({
        id: page.id,
        title: page.title,
        description: page.description || '',
        format: page.code_type,
        viewCount: page.view_count,
        shareCount: page.share_count,
        createdAt: page.created_at,
        author: (page.render_profiles as unknown as { display_name: string })?.display_name || '匿名用户',
        thumbnail: this.generateThumbnail(page.code_type)
      }));

      return {
        success: true,
        data: formattedWorks
      };
    } catch (error) {
      return {
        success: false,
        error: `获取最新作品时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 按代码类型获取作品统计
   */
  static async getWorkStatsByType(): Promise<ServiceResponse<Record<string, number>>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .select('code_type')
        .eq('status', 'published');

      if (error) {
        return {
          success: false,
          error: `获取作品统计失败: ${error.message}`
        };
      }

      const stats: Record<string, number> = {};
      data?.forEach(page => {
        stats[page.code_type] = (stats[page.code_type] || 0) + 1;
      });

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: `获取作品统计时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 搜索作品
   */
  static async searchWorks(
    query: string,
    options: GalleryFilters & PaginationOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<GalleryWork>>> {
    try {
      const { 
        format,
        limit = 20, 
        offset = 0 
      } = options;

      let dbQuery = supabase
        .from('render_pages')
        .select(`
          id,
          title,
          description,
          code_type,
          view_count,
          share_count,
          created_at,
          render_profiles!inner(display_name)
        `, { count: 'exact' })
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

      if (format && format !== 'all') {
        dbQuery = dbQuery.eq('code_type', format);
      }

      const { data, error, count } = await dbQuery
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return {
          success: false,
          error: `搜索作品失败: ${error.message}`
        };
      }

      const formattedWorks: GalleryWork[] = (data || []).map(page => ({
        id: page.id,
        title: page.title,
        description: page.description || '',
        format: page.code_type,
        viewCount: page.view_count,
        shareCount: page.share_count,
        createdAt: page.created_at,
        author: (page.render_profiles as unknown as { display_name: string })?.display_name || '匿名用户',
        thumbnail: this.generateThumbnail(page.code_type)
      }));

      return {
        success: true,
        data: {
          data: formattedWorks,
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasMore: (count || 0) > offset + limit
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `搜索作品时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 生成缩略图
   */
  private static generateThumbnail(codeType: string): string {
    const thumbnails = {
      html: '🌐',
      markdown: '📝',
      svg: '🎨',
      mermaid: '📊'
    };
    return thumbnails[codeType as keyof typeof thumbnails] || thumbnails.html;
  }

  /**
   * 获取推荐作品（基于用户浏览历史或热门程度）
   */
  static async getRecommendedWorks(
    userId?: string,
    limit: number = 10
  ): Promise<ServiceResponse<GalleryWork[]>> {
    try {
      // 简单的推荐算法：如果有用户ID，可以基于用户偏好；否则返回热门作品
      if (userId) {
        // TODO: 实现基于用户偏好的推荐算法
        // 目前先返回热门作品
        return this.getPopularWorks(limit);
      } else {
        return this.getPopularWorks(limit);
      }
    } catch (error) {
      return {
        success: false,
        error: `获取推荐作品时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}
