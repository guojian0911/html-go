
/**
 * 页面指标服务 - 处理浏览量、分享量等统计相关操作
 */

import { supabase } from '@/integrations/supabase/client';
import type { ServiceResponse } from '../types/ServiceTypes';

export class PageMetricsService {
  /**
   * 增加页面浏览次数
   */
  static async incrementViewCount(pageId: string): Promise<ServiceResponse<void>> {
    try {
      // 直接使用传统方法更新浏览次数
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
