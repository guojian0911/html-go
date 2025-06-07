import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UserProfile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    } else {
      setProfile(null);
      setLoading(false);
      setError(null);
    }
  }, [user, isAuthenticated]);

  const fetchUserProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('render_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) {
        // 如果用户资料不存在，这是正常的（可能还没有同步）
        if (fetchError.code === 'PGRST116') {
          setProfile(null);
        } else {
          throw fetchError;
        }
      } else {
        setProfile(data);
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError(err.message || '获取用户资料失败');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    if (isAuthenticated && user) {
      fetchUserProfile();
    }
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
    hasProfile: !!profile
  };
};
