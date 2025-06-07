/**
 * 分享功能相关的服务
 * 负责处理页面分享、访问控制和统计更新
 */

import { supabase } from '@/integrations/supabase/client';
import type { RenderPage } from './types/PageTypes';
import type { ServiceResponse } from './types/ServiceTypes';

export interface ShareData {
  id: string;
  content: string;
  createdAt: number;
  codeType: string;
  isProtected: boolean;
  title?: string;
  description?: string;
}

export interface ShareAccessOptions {
  password?: string;
  incrementView?: boolean;
}

export class ShareService {
  /**
   * 获取分享内容
   */
  static async getShareData(
    shareId: string, 
    options: ShareAccessOptions = {}
  ): Promise<ServiceResponse<ShareData>> {
    try {
      const { password, incrementView = true } = options;

      // 获取页面数据
      const { data: pageData, error } = await supabase
        .from('render_pages')
        .select('*')
        .eq('id', shareId)
        .single();

      if (error || !pageData) {
        return {
          success: false,
          error: '找不到指定的分享内容'
        };
      }

      // 检查密码保护
      if (pageData.is_protected) {
        if (!password) {
          return {
            success: false,
            error: '需要密码访问此分享'
          };
        }

        if (pageData.password !== password) {
          return {
            success: false,
            error: '密码错误'
          };
        }
      }

      // 增加浏览次数（异步执行，不影响响应速度）
      if (incrementView) {
        this.incrementViewCountAsync(shareId);
      }

      // 转换数据格式
      const shareData: ShareData = {
        id: pageData.id,
        content: pageData.html_content,
        createdAt: new Date(pageData.created_at).getTime(),
        codeType: pageData.code_type,
        isProtected: pageData.is_protected,
        title: pageData.title,
        description: pageData.description || undefined
      };

      return {
        success: true,
        data: shareData
      };
    } catch (error) {
      return {
        success: false,
        error: `获取分享内容时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 验证分享访问权限
   */
  static async validateShareAccess(
    shareId: string, 
    password?: string
  ): Promise<ServiceResponse<{ isValid: boolean; requiresPassword: boolean }>> {
    try {
      const { data: pageData, error } = await supabase
        .from('render_pages')
        .select('is_protected, password')
        .eq('id', shareId)
        .single();

      if (error || !pageData) {
        return {
          success: false,
          error: '找不到指定的分享内容'
        };
      }

      const requiresPassword = pageData.is_protected;
      let isValid = true;

      if (requiresPassword) {
        if (!password) {
          isValid = false;
        } else if (pageData.password !== password) {
          isValid = false;
        }
      }

      return {
        success: true,
        data: {
          isValid,
          requiresPassword
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `验证访问权限时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 创建分享链接（保存草稿）
   */
  static async createShare(
    userId: string,
    code: string,
    format: string,
    options: {
      title?: string;
      description?: string;
      password?: string;
      isProtected?: boolean;
    } = {}
  ): Promise<ServiceResponse<{ shareId: string; shareUrl: string }>> {
    try {
      const { title, description, password, isProtected } = options;

      const { data, error } = await supabase
        .from('render_pages')
        .insert({
          user_id: userId,
          title: title || `${format.toUpperCase()} 草稿`,
          description: description || `通过 HTML-Go 创建的 ${format} 草稿`,
          html_content: code,
          code_type: format,
          status: 'draft',
          is_protected: !!isProtected,
          password: isProtected ? password : null
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `创建分享失败: ${error.message}`
        };
      }

      return {
        success: true,
        data: {
          shareId: data.id,
          shareUrl: `/profile?tab=draft`
        },
        message: '草稿已保存到草稿箱'
      };
    } catch (error) {
      return {
        success: false,
        error: `创建分享时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 更新分享内容
   */
  static async updateShare(
    shareId: string,
    userId: string,
    updates: {
      code?: string;
      title?: string;
      description?: string;
      password?: string;
      isProtected?: boolean;
    }
  ): Promise<ServiceResponse<RenderPage>> {
    try {
      const updateData: any = {};

      if (updates.code !== undefined) {
        updateData.html_content = updates.code;
      }
      if (updates.title !== undefined) {
        updateData.title = updates.title;
      }
      if (updates.description !== undefined) {
        updateData.description = updates.description;
      }
      if (updates.isProtected !== undefined) {
        updateData.is_protected = updates.isProtected;
        updateData.password = updates.isProtected ? updates.password : null;
      }

      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('render_pages')
        .update(updateData)
        .eq('id', shareId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `更新分享失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '分享内容更新成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `更新分享时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 增加分享次数
   */
  static async incrementShareCount(shareId: string): Promise<ServiceResponse<void>> {
    try {
      // 先获取当前分享次数
      const { data: currentData, error: fetchError } = await supabase
        .from('render_pages')
        .select('share_count')
        .eq('id', shareId)
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
        .eq('id', shareId);

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

  /**
   * 异步增加浏览次数（不阻塞主流程）
   */
  private static incrementViewCountAsync(shareId: string): void {
    // 使用 setTimeout 确保异步执行
    setTimeout(async () => {
      try {
        // 先获取当前浏览次数
        const { data: currentData, error: fetchError } = await supabase
          .from('render_pages')
          .select('view_count')
          .eq('id', shareId)
          .single();

        if (fetchError) {
          console.error('获取当前浏览次数失败:', fetchError);
          return;
        }

        // 增加浏览次数
        const { error } = await supabase
          .from('render_pages')
          .update({ view_count: (currentData?.view_count || 0) + 1 })
          .eq('id', shareId);

        if (error) {
          console.error('更新浏览次数失败:', error);
        }
      } catch (error) {
        console.error('异步更新浏览次数时发生错误:', error);
      }
    }, 0);
  }

  /**
   * 获取分享统计信息
   */
  static async getShareStats(shareId: string): Promise<ServiceResponse<{
    viewCount: number;
    shareCount: number;
    createdAt: string;
    lastViewed?: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('render_pages')
        .select('view_count, share_count, created_at, updated_at')
        .eq('id', shareId)
        .single();

      if (error) {
        return {
          success: false,
          error: `获取分享统计失败: ${error.message}`
        };
      }

      return {
        success: true,
        data: {
          viewCount: data.view_count || 0,
          shareCount: data.share_count || 0,
          createdAt: data.created_at,
          lastViewed: data.updated_at
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `获取分享统计时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 删除分享
   */
  static async deleteShare(
    shareId: string, 
    userId: string
  ): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('render_pages')
        .delete()
        .eq('id', shareId)
        .eq('user_id', userId);

      if (error) {
        return {
          success: false,
          error: `删除分享失败: ${error.message}`
        };
      }

      return {
        success: true,
        message: '分享删除成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `删除分享时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}
