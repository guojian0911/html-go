
/**
 * 页面更新服务 - 处理页面内容和状态的更新操作
 */

import { supabase } from '@/integrations/supabase/client';
import type { 
  RenderPage, 
  UpdatePageData,
  PublishPageData
} from '../types/PageTypes';
import type { ServiceResponse } from '../types/ServiceTypes';

export class PageUpdateService {
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
}
