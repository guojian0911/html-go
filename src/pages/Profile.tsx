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
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/loading';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Edit, Trash2, Eye, Share2, Settings, User, Send, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import AppHeader from '@/components/common/AppHeader';
import PublishDialog, { PublishData } from '@/components/PublishDialog';
import ShareLinkDialog from '@/components/ShareLinkDialog';

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

// 用户信息卡片骨架屏
const UserProfileSkeleton = () => (
  <Card className="mb-8">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-5 w-64 mb-3" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </CardHeader>
  </Card>
);

// 项目卡片骨架屏
const ProjectCardSkeleton = () => (
  <Card className="h-full flex flex-col">
    <CardHeader className="flex-1">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full ml-2" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 flex-1" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </CardContent>
  </Card>
);

// 项目列表骨架屏
const ProjectGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <ProjectCardSkeleton key={i} />
    ))}
  </div>
);

// 错误状态组件
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="text-center py-16">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertTriangle className="w-8 h-8 text-red-600" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
    <p className="text-gray-600 mb-6">{error}</p>
    <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700">
      <RefreshCw className="w-4 h-4 mr-2" />
      重试
    </Button>
  </div>
);

const Profile = () => {
  const { user, loading } = useAuth();
  const [pages, setPages] = useState<RenderPage[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ display_name: '', bio: '', avatar_url: '' });
  const { loading: isLoading, error, execute, setError } = useLoadingState({ 
    initialLoading: true, 
    minLoadingTime: 500 
  });
  const [activeTab, setActiveTab] = useState('published');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishingPageId, setPublishingPageId] = useState<string | null>(null);
  const [isShareLinkDialogOpen, setIsShareLinkDialogOpen] = useState(false);
  const [sharingPageId, setSharingPageId] = useState<string | null>(null);
  const [deletingPages, setDeletingPages] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  // 处理URL参数，设置活动标签
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'draft' || tab === 'published') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchUserData = async () => {
    await execute(async () => {
      // 获取用户页面
      const { data: pagesData, error: pagesError } = await supabase
        .from('render_pages')
        .select('*')
        .eq('user_id', user!.id)
        .order('updated_at', { ascending: false });

      if (pagesError) throw pagesError;

      // 获取用户资料
      const { data: profileData, error: profileError } = await supabase
        .from('render_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      return {
        pages: pagesData || [],
        profile: profileData || { display_name: '', bio: '', avatar_url: '' }
      };
    }, {
      onSuccess: (data: { pages: RenderPage[], profile: UserProfile }) => {
        setPages(data.pages);
        setProfile(data.profile);
      },
      onError: (error) => {
        toast({
          title: "加载失败",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "更新个人资料时发生错误";
      toast({
        title: "更新失败",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const deletePage = async (pageId: string) => {
    if (!confirm('确定要删除这个页面吗？')) return;

    setDeletingPages(prev => new Set(prev).add(pageId));

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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "删除页面时发生错误";
      toast({
        title: "删除失败",
        description: message,
        variant: "destructive",
      });
    } finally {
      setDeletingPages(prev => {
        const newSet = new Set(prev);
        newSet.delete(pageId);
        return newSet;
      });
    }
  };

  // 打开发布弹框
  const openPublishDialog = (pageId: string) => {
    setPublishingPageId(pageId);
    setIsPublishDialogOpen(true);
  };

  // 打开分享弹框
  const openShareDialog = (pageId: string) => {
    setSharingPageId(pageId);
    setIsShareLinkDialogOpen(true);
  };

  // 处理发布
  const handlePublish = async (publishData: PublishData) => {
    if (!publishingPageId) return;

    try {
      // 更新数据库状态
      const { error } = await supabase
        .from('render_pages')
        .update({
          status: 'published',
          title: publishData.title,
          description: publishData.description,
          tags: publishData.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', publishingPageId)
        .eq('user_id', user!.id);

      if (error) throw error;

      // 更新本地状态
      setPages(pages.map(p =>
        p.id === publishingPageId
          ? {
              ...p,
              status: 'published',
              title: publishData.title,
              description: publishData.description,
              updated_at: new Date().toISOString()
            }
          : p
      ));

      toast({
        title: "发布成功",
        description: "你的作品已发布，现在其他人可以在画廊中看到它！",
      });

      // 关闭弹框
      setIsPublishDialogOpen(false);
      setPublishingPageId(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "发布作品时发生错误";
      toast({
        title: "发布失败",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    fetchUserData();
  };

  // 渲染项目卡片
  const renderProjectCard = (page: RenderPage) => {
    const isDeleting = deletingPages.has(page.id);
    
    return (
      <LoadingOverlay 
        key={page.id} 
        loading={isDeleting} 
        text="删除中..."
        className="h-full"
      >
        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
          <CardHeader className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg line-clamp-1">{page.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {page.description || '暂无描述'}
                </CardDescription>
              </div>
              <div className="flex space-x-2 ml-2">
                <Badge variant="outline">
                  {page.code_type.toUpperCase()}
                </Badge>
                {page.status === 'draft' && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    草稿
                  </Badge>
                )}
              </div>
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
                  <Share2 className="w-4 h-4" />
                  <span>{page.share_count}</span>
                </div>
              </div>
              <span>{new Date(page.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(`/share/${page.id}?preview=true`, '_blank')}
                className="flex-1"
                disabled={isDeleting}
              >
                预览
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/editor?id=${page.id}`)}
                disabled={isDeleting}
              >
                <Edit className="w-4 h-4" />
              </Button>
              {page.status === 'published' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openShareDialog(page.id)}
                  disabled={isDeleting}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openPublishDialog(page.id)}
                    disabled={isDeleting}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deletePage(page.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </LoadingOverlay>
    );
  };

  // 认证加载状态
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader showNavigation={true} currentPage="profile" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfileSkeleton />
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-1 mb-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              <ProjectGridSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 数据加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader showNavigation={true} currentPage="profile" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserProfileSkeleton />
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-32" />
            </CardHeader>
            <CardContent>
              <div className="flex space-x-1 mb-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-24" />
              </div>
              <ProjectGridSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader showNavigation={true} currentPage="profile" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorState error={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <AppHeader showNavigation={true} currentPage="profile" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16 ring-2 ring-transparent hover:ring-blue-200 transition-all duration-200">
                  <AvatarImage 
                    src={profile.avatar_url} 
                    alt={profile.display_name || "用户头像"}
                    className="transition-opacity duration-200"
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl text-gray-900">{profile.display_name || user?.email}</CardTitle>
                  <CardDescription className="text-base mt-1 text-gray-600">
                    {profile.bio || '还没有个人简介'}
                  </CardDescription>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="font-medium">{pages.length} 个项目</span>
                    <span className="font-medium">{pages.filter(p => p.status === 'published').length} 已发布</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors duration-200">
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
                        disabled={isUpdatingProfile}
                      />
                      <Textarea
                        placeholder="个人简介"
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        disabled={isUpdatingProfile}
                      />
                      <Input
                        placeholder="头像URL"
                        value={profile.avatar_url}
                        onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
                        disabled={isUpdatingProfile}
                      />
                      <div className="flex space-x-2">
                        <Button type="submit" disabled={isUpdatingProfile} className="min-w-[80px]">
                          {isUpdatingProfile ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              保存中...
                            </>
                          ) : (
                            '保存'
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditingProfile(false)}
                          disabled={isUpdatingProfile}
                        >
                          取消
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* 项目管理 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-gray-900">我的项目</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="published" className="transition-all duration-200">
                  已发布 ({pages.filter(p => p.status === 'published').length})
                </TabsTrigger>
                <TabsTrigger value="draft" className="transition-all duration-200">
                  草稿 ({pages.filter(p => p.status === 'draft').length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="published" className="mt-6">
                {pages.filter(p => p.status === 'published').length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Share2 className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">还没有发布的项目</h3>
                    <p className="text-gray-600 mb-6">创建您的第一个项目并发布到画廊</p>
                    <Button 
                      onClick={() => navigate('/editor')}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      创建第一个项目
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.filter(p => p.status === 'published').map(renderProjectCard)}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="draft" className="mt-6">
                {pages.filter(p => p.status === 'draft').length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Edit className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">还没有草稿项目</h3>
                    <p className="text-gray-600 mb-2">使用编辑器创建内容并点击"保存草稿"按钮</p>
                    <p className="text-sm text-gray-500 mb-6">草稿将出现在这里，您可以随时编辑和发布</p>
                    <Button 
                      onClick={() => navigate('/editor')}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    >
                      创建第一个项目
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pages.filter(p => p.status === 'draft').map(renderProjectCard)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* 发布弹框 */}
      {publishingPageId && (
        <PublishDialog
          isOpen={isPublishDialogOpen}
          onClose={() => {
            setIsPublishDialogOpen(false);
            setPublishingPageId(null);
          }}
          onPublish={handlePublish}
          initialTitle={pages.find(p => p.id === publishingPageId)?.title || ''}
          initialDescription={pages.find(p => p.id === publishingPageId)?.description || ''}
          codeType={pages.find(p => p.id === publishingPageId)?.code_type || 'html'}
        />
      )}

      {/* 分享弹框 */}
      {sharingPageId && (
        <ShareLinkDialog
          isOpen={isShareLinkDialogOpen}
          onClose={() => {
            setIsShareLinkDialogOpen(false);
            setSharingPageId(null);
          }}
          pageId={sharingPageId}
          title={pages.find(p => p.id === sharingPageId)?.title || ''}
          codeType={pages.find(p => p.id === sharingPageId)?.code_type || 'html'}
        />
      )}
    </div>
  );
};

export default Profile;
