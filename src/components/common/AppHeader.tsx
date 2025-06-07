import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Code2, User, Settings, LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

interface AppHeaderProps {
  showNavigation?: boolean;
  currentPage?: 'gallery' | 'profile' | 'editor' | 'other';
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  showNavigation = false, 
  currentPage = 'other' 
}) => {
  const navigate = useNavigate();
  const { user, signOut, isAuthenticated } = useAuth();
  const { profile } = useUserProfile();

  // Logo点击直接导航
  const handleLogoClick = () => navigate('/');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - 可点击跳转到首页 */}
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg p-2 -m-2"
            onClick={handleLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogoClick();
              }
            }}
            aria-label="返回首页"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 font-display">HTML-Go</h1>
              <p className="text-xs text-gray-600">多格式渲染分享平台</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* 创建按钮 */}
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/editor')}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 p-0 flex items-center justify-center focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
                size="icon"
                aria-label="创建新项目"
              >
                <Plus className="w-5 h-5 text-white" />
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                登录
              </Button>
            )}

            {/* User menu */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all duration-200">
                    <AvatarImage 
                      src={profile?.avatar_url || ""} 
                      alt={profile?.display_name || "用户头像"}
                      className="transition-opacity duration-200"
                    />
                    <AvatarFallback className="bg-gray-200 hover:bg-gray-300 transition-colors duration-200">
                      {profile?.display_name ? (
                        <span className="text-sm font-medium text-gray-700">
                          {profile.display_name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User className="w-4 h-4 text-gray-700" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="focus:bg-gray-100 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    个人主页
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="focus:bg-gray-100 cursor-pointer text-red-600 focus:text-red-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    登出
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
