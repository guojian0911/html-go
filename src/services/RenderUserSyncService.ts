import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SyncResult {
  success: boolean;
  action: 'created' | 'updated' | 'no_change' | 'error';
  message: string;
  profile?: UserProfile;
  error?: any;
}

export class RenderUserSyncService {
  /**
   * 同步用户信息到 render_profiles 表
   * @param user Supabase 用户对象
   * @returns 同步结果
   */
  static async syncUserProfile(user: User): Promise<SyncResult> {
    try {
      console.log('开始同步用户资料:', user.id);

      // 检查用户资料是否已存在
      const { data: existingProfile, error: checkError } = await supabase
        .from('render_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('检查用户资料时出错:', checkError);
        return {
          success: false,
          action: 'error',
          message: `检查用户资料失败: ${checkError.message}`,
          error: checkError
        };
      }

      // 从 auth.users 获取用户信息
      const displayName = this.extractDisplayName(user);
      const avatarUrl = user.user_metadata?.avatar_url || null;

      if (existingProfile) {
        // 检查是否需要更新
        const needsUpdate = 
          existingProfile.display_name !== displayName ||
          existingProfile.avatar_url !== avatarUrl;

        if (!needsUpdate) {
          console.log('用户资料无需更新');
          return {
            success: true,
            action: 'no_change',
            message: '用户资料已是最新',
            profile: existingProfile
          };
        }

        // 更新现有资料
        const { data: updatedProfile, error: updateError } = await supabase
          .from('render_profiles')
          .update({
            display_name: displayName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('更新用户资料时出错:', updateError);
          return {
            success: false,
            action: 'error',
            message: `更新用户资料失败: ${updateError.message}`,
            error: updateError
          };
        }

        console.log('用户资料更新成功');
        return {
          success: true,
          action: 'updated',
          message: '用户资料已更新',
          profile: updatedProfile
        };
      } else {
        // 创建新的用户资料
        const { data: newProfile, error: createError } = await supabase
          .from('render_profiles')
          .insert({
            id: user.id,
            display_name: displayName,
            avatar_url: avatarUrl
          })
          .select()
          .single();

        if (createError) {
          console.error('创建用户资料时出错:', createError);
          return {
            success: false,
            action: 'error',
            message: `创建用户资料失败: ${createError.message}`,
            error: createError
          };
        }

        console.log('用户资料创建成功');
        return {
          success: true,
          action: 'created',
          message: '用户资料已创建',
          profile: newProfile
        };
      }
    } catch (error) {
      console.error('同步用户资料时发生未知错误:', error);
      return {
        success: false,
        action: 'error',
        message: `同步失败: ${error instanceof Error ? error.message : '未知错误'}`,
        error
      };
    }
  }

  /**
   * 从用户对象中提取显示名称
   * @param user Supabase 用户对象
   * @returns 显示名称
   */
  private static extractDisplayName(user: User): string {
    return user.user_metadata?.display_name || 
           user.user_metadata?.full_name || 
           user.user_metadata?.name ||
           user.email?.split('@')[0] || 
           '用户';
  }


}
