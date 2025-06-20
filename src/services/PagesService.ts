
/**
 * 页面相关的数据库操作服务
 * 负责处理 render_pages 表的所有 CRUD 操作
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  RenderPage, 
  CreatePageData, 
  UpdatePageData, 
  PublishPageData,
  FilterOptions,
  PaginationOptions 
} from './types/PageTypes';
import type { ServiceResponse, PaginatedResponse } from './types/ServiceTypes';

export class PagesService {
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
   * 更新页面
   */
  static async updatePage(
    pageId: string, 
    userId: string, 
    updateData: UpdatePageData
  ): Promise<ServiceResponse<RenderPage>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `更新页面失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '页面更新成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `更新页面时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 更新页面的 HTML 内容
   */
  static async updatePageContent(
    pageId: string, 
    userId: string, 
    htmlContent: string
  ): Promise<ServiceResponse<RenderPage>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .update({
          html_content: htmlContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `更新页面内容失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '页面内容更新成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `更新页面内容时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 发布页面
   */
  static async publishPage(
    pageId: string, 
    userId: string, 
    publishData: PublishPageData
  ): Promise<ServiceResponse<RenderPage>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .update({
          status: 'published',
          title: publishData.title,
          description: publishData.description,
          tags: publishData.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `发布页面失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '页面发布成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `发布页面时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
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

  /**
   * 增加页面浏览次数
   */
  static async incrementViewCount(pageId: string): Promise<ServiceResponse<void>> {
    try {
      // 使用 RPC 调用来原子性地增加浏览次数
      const { error } = await supabase.rpc('increment_view_count', {
        page_id: pageId
      });

      if (error) {
        // 如果 RPC 不存在，回退到传统方法
        const { data: currentData, error: fetchError } = await supabase
          .from('render_pages')
          .select('view_count')
          .eq('id', pageId)
          .single();

        if (fetchError) {
          return {
            success: false,
            error: `获取当前浏览次数失败: ${fetchError.message}`
          };
        }

        const { error: updateError } = await supabase
          .from('render_pages')
          .update({ view_count: (currentData?.view_count || 0) + 1 })
          .eq('id', pageId);

        if (updateError) {
          return {
            success: false,
            error: `更新浏览次数失败: ${updateError.message}`
          };
        }
      }

      return {
        success: true,
        message: '浏览次数更新成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `更新浏览次数时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 增加页面分享次数
   */
  static async incrementShareCount(pageId: string): Promise<ServiceResponse<void>> {
    try {
      // 先获取当前分享次数
      const { data: currentData, error: fetchError } = await supabase
        .from('render_pages')
        .select('share_count')
        .eq('id', pageId)
        .single();

      if (fetchError) {
        return {
          success: false,
          error: `获取当前分享次数失败: ${fetchError.message}`
        };
      }

      // 增加分享次数
      const { error } = await supabase
        .from('render_pages')
        .update({ share_count: (currentData?.share_count || 0) + 1 })
        .eq('id', pageId);

      if (error) {
        return {
          success: false,
          error: `更新分享次数失败: ${error.message}`
        };
      }

      return {
        success: true,
        message: '分享次数更新成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `更新分享次数时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}
