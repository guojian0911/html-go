
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Code2, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GalleryHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">HTML-Go</h1>
              <p className="text-xs text-gray-500">多格式渲染分享平台</p>
            </div>
          </div>

          {/* 右侧操作区 */}
          <div className="flex items-center space-x-4">
            {/* 快速创建按钮 - 只显示加号 */}
            <Button 
              onClick={() => navigate('/editor')}
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center"
              size="icon"
            >
              <Plus className="w-5 h-5" />
            </Button>

            {/* 用户头像/登录按钮 */}
            <div className="flex items-center">
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src="" />
                <AvatarFallback className="bg-gray-200">
                  <User className="w-4 h-4 text-gray-600" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default GalleryHeader;
