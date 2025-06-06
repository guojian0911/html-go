
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, Eye, Share, Settings, User, LogOut } from 'lucide-react';

interface RenderPage {
  id: string;
  title: string;
  description: string;
  code_type: string;
  status: string;
  view_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  display_name: string;
  bio: string;
  avatar_url: string;
}

const Profile = () => {
  const { user, signOut, loading } = useAuth();
  const [pages, setPages] = useState<RenderPage[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ display_name: '', bio: '', avatar_url: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, loading, navigate]);

  const fetchUserData = async () => {
    try {
      // 获取用户页面
      const { data: pagesData, error: pagesError } = await supabase
        .from('render_pages')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });

      if (pagesError) throw pagesError;
      setPages(pagesData || []);

      // 获取用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('render_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        setProfile(profileData);
      }
    } catch (error: any) {
      toast({
        title: "加载失败",
        description: error.message || "无法加载用户数据",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('render_profiles')
        .upsert({
          id: user!.id,
          display_name: profile.display_name,
          bio: profile.bio,
          avatar_url: profile.avatar_url,
        });

      if (error) throw error;

      toast({
        title: "更新成功",
        description: "个人资料已更新",
      });
      setIsEditingProfile(false);
    } catch (error: any) {
      toast({
        title: "更新失败",
        description: error.message || "更新个人资料时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm('确定要删除这个页面吗？')) return;

    try {
      const { error } = await supabase
        .from('render_pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      setPages(pages.filter(page => page.id !== pageId));
      toast({
        title: "删除成功",
        description: "页面已删除",
      });
    } catch (error: any) {
      toast({
        title: "删除失败",
        description: error.message || "删除页面时发生错误",
        variant: "destructive",
      });
    }
  };

  const filteredPages = pages.filter(page => 
    activeTab === 'published' ? page.status === 'published' : page.status === 'draft'
  );

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.display_name || user?.email}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {profile.bio || '还没有个人简介'}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>{pages.length} 个项目</span>
                    <span>{pages.filter(p => p.status === 'published').length} 已发布</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      编辑资料
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>编辑个人资料</DialogTitle>
                      <DialogDescription>
                        更新您的个人信息
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateProfile} className="space-y-4">
                      <Input
                        placeholder="显示名称"
                        value={profile.display_name}
                        onChange={(e) => setProfile({...profile, display_name: e.target.value})}
                      />
                      <Textarea
                        placeholder="个人简介"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      />
                      <Input
                        placeholder="头像URL"
                        value={profile.avatar_url}
                        onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                      />
                      <div className="flex space-x-2">
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? '保存中...' : '保存'}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setIsEditingProfile(false)}>
                          取消
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  登出
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 项目管理 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>我的项目</CardTitle>
              <Button onClick={() => navigate('/editor')}>
                创建新项目
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="published">已发布 ({pages.filter(p => p.status === 'published').length})</TabsTrigger>
                <TabsTrigger value="draft">草稿 ({pages.filter(p => p.status === 'draft').length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-6">
                {filteredPages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">
                      {activeTab === 'published' ? '还没有发布的项目' : '还没有草稿项目'}
                    </p>
                    <Button onClick={() => navigate('/editor')}>
                      创建第一个项目
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPages.map((page) => (
                      <Card key={page.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg line-clamp-1">{page.title}</CardTitle>
                              <CardDescription className="line-clamp-2 mt-1">
                                {page.description || '暂无描述'}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="ml-2">
                              {page.code_type.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{page.view_count}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Share className="w-4 h-4" />
                                <span>{page.share_count}</span>
                              </div>
                            </div>
                            <span>{new Date(page.updated_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/work/${page.id}`)}
                              className="flex-1"
                            >
                              查看
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/editor?id=${page.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deletePage(page.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
