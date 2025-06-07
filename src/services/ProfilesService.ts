/**
 * 用户资料相关的数据库操作服务
 * 负责处理 render_profiles 表的所有 CRUD 操作
 */

import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from './types/PageTypes';
import type { ServiceResponse } from './types/ServiceTypes';

export interface UpdateProfileData {
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface CreateProfileData {
  id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
}

export class ProfilesService {
  /**
   * 根据用户ID获取用户资料
   */
  static async getProfileById(userId: string): Promise<ServiceResponse<UserProfile | null>> {
    try {
      const { data, error } = await supabase
        .from('render_profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return {
          success: false,
          error: `获取用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: `获取用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 批量获取用户资料
   */
  static async getProfilesByIds(userIds: string[]): Promise<ServiceResponse<UserProfile[]>> {
    try {
      if (userIds.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      const { data, error } = await supabase
        .from('render_profiles')
        .select('*')
        .in('id', userIds);

      if (error) {
        return {
          success: false,
          error: `批量获取用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: `批量获取用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 创建用户资料
   */
  static async createProfile(profileData: CreateProfileData): Promise<ServiceResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('render_profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `创建用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '用户资料创建成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `创建用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 更新用户资料
   */
  static async updateProfile(
    userId: string, 
    updateData: UpdateProfileData
  ): Promise<ServiceResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('render_profiles')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `更新用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '用户资料更新成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `更新用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 创建或更新用户资料（Upsert操作）
   */
  static async upsertProfile(profileData: CreateProfileData): Promise<ServiceResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('render_profiles')
        .upsert({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: `保存用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data,
        message: '用户资料保存成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `保存用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 删除用户资料
   */
  static async deleteProfile(userId: string): Promise<ServiceResponse<void>> {
    try {
      const { error } = await supabase
        .from('render_profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        return {
          success: false,
          error: `删除用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        message: '用户资料删除成功'
      };
    } catch (error) {
      return {
        success: false,
        error: `删除用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 检查用户资料是否存在
   */
  static async profileExists(userId: string): Promise<ServiceResponse<boolean>> {
    try {
      const { data, error } = await supabase
        .from('render_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return {
          success: false,
          error: `检查用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data: !!data
      };
    } catch (error) {
      return {
        success: false,
        error: `检查用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 搜索用户资料
   */
  static async searchProfiles(
    query: string, 
    limit: number = 10
  ): Promise<ServiceResponse<UserProfile[]>> {
    try {
      const { data, error } = await supabase
        .from('render_profiles')
        .select('*')
        .or(`display_name.ilike.%${query}%,bio.ilike.%${query}%`)
        .limit(limit);

      if (error) {
        return {
          success: false,
          error: `搜索用户资料失败: ${error.message}`
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      return {
        success: false,
        error: `搜索用户资料时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }

  /**
   * 获取用户统计信息
   */
  static async getUserStats(userId: string): Promise<ServiceResponse<{
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    totalViews: number;
    totalShares: number;
  }>> {
    try {
      // 获取页面统计
      const { data: pagesData, error: pagesError } = await supabase
        .from('render_pages')
        .select('status, view_count, share_count')
        .eq('user_id', userId);

      if (pagesError) {
        return {
          success: false,
          error: `获取用户统计失败: ${pagesError.message}`
        };
      }

      const stats = {
        totalPages: pagesData?.length || 0,
        publishedPages: pagesData?.filter(p => p.status === 'published').length || 0,
        draftPages: pagesData?.filter(p => p.status === 'draft').length || 0,
        totalViews: pagesData?.reduce((sum, p) => sum + (p.view_count || 0), 0) || 0,
        totalShares: pagesData?.reduce((sum, p) => sum + (p.share_count || 0), 0) || 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: `获取用户统计时发生错误: ${error instanceof Error ? error.message : '未知错误'}`
      };
    }
  }
}
