
/**
 * 基础页面服务 - 处理基本的 CRUD 操作
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  RenderPage, 
  CreatePageData, 
  UpdatePageData,
  FilterOptions,
  PaginationOptions 
} from '../types/PageTypes';
import type { ServiceResponse, PaginatedResponse } from '../types/ServiceTypes';

export class BasePagesService {
  /**
   * 获取用户的所有页面（支持分页和过滤）
   */
  static async getUserPages(
    userId: string, 
    options: FilterOptions & PaginationOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<RenderPage>>> {
    try {
      const { 
        status, 
        code_type, 
        search,
        limit = 20, 
        offset = 0 
      } = options;

      let query = supabase
        .from('render_pages')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // 应用过滤条件
      if (status) {
        query = query.eq('status', status);
      }
      
      if (code_type) {
        query = query.eq('code_type', code_type);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }

      // 排序和分页
      const { data, error, count } = await query
        .order('updated_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return {
          success: false,
          error: `获取页面失败: ${error.message}`
        };
      }

      return {
        success: true,
        data: {
          data: data || [],
          total: count || 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasMore: (count || 0) > offset + limit
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `获取页面时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 根据ID获取单个页面
   */
  static async getPageById(
    pageId: string, 
    userId?: string
  ): Promise<ServiceResponse<RenderPage>> {
    try {
      let query = supabase
        .from('render_pages')
        .select('*')
        .eq('id', pageId);

      // 如果提供了用户ID，添加用户验证
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.single();

      if (error) {
        return {
          success: false,
          error: `获取页面失败: ${error.message}`
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: `获取页面时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 创建新页面
   */
  static async createPage(
    userId: string, 
    pageData: CreatePageData
  ): Promise<ServiceResponse<RenderPage>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .insert({
          user_id: userId,
          ...pageData,
          status: pageData.status || 'draft'
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `创建页面失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '页面创建成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `创建页面时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 删除页面
   */
  static async deletePage(
    pageId: string, 
    userId: string
  ): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('render_pages')
        .delete()
        .eq('id', pageId)
        .eq('user_id', userId);

      if (error) {
        return {
          success: false,
          error: `删除页面失败: ${error.message}`
        };
      }

      return {
        success: true,
        message: '页面删除成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `删除页面时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}
