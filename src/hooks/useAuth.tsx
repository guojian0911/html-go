
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { RenderUserSyncService } from '@/services/RenderUserSyncService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);

        setSession(session);
        setUser(session?.user ?? null);

        // 立即设置 loading 为 false，不等待同步完成
        setLoading(false);

        // 在用户登录时自动同步用户资料（异步执行，不阻塞登录）
        if (session?.user && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          // 使用 setTimeout 确保同步操作不阻塞主流程
          setTimeout(async () => {
            try {
              console.log('开始自动同步用户资料...');
              const result = await RenderUserSyncService.syncUserProfile(session.user);

              if (result.success) {
                console.log('用户资料同步成功:', result.action);
              } else {
                console.error('用户资料同步失败:', result.message);
              }
            } catch (error) {
              console.error('同步用户资料时发生错误:', error);
            }
          }, 100);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/auth';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
};
