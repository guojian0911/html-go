
import React from 'react';
import { Share2, FileText, Github, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopToolbarProps {
  onShare: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ onShare }) => {
  return (
    <div className="toolbar h-16 flex items-center justify-between px-6">
      {/* 左侧 - Logo 和标题 */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-info rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">
              HTML-Go
            </h1>
            <p className="text-xs text-gray-500">多格式渲染分享平台</p>
          </div>
        </div>
        
        {/* 状态指示器 */}
        <div className="flex items-center space-x-2 ml-6">
          <div className="status-indicator status-success"></div>
          <span className="text-sm text-gray-600">就绪</span>
        </div>
      </div>
      
      {/* 右侧 - 操作按钮 */}
      <div className="flex items-center space-x-3">
        {/* GitHub 链接 */}
        <Button variant="ghost" size="sm" className="btn-ghost">
          <Github className="w-4 h-4 mr-2" />
          GitHub
        </Button>
        
        {/* 文档链接 */}
        <Button variant="ghost" size="sm" className="btn-ghost">
          <FileText className="w-4 h-4 mr-2" />
          文档
        </Button>
        
        {/* 分享按钮 */}
        <Button 
          onClick={onShare}
          className="btn-primary btn-hover"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          分享
        </Button>
        
        {/* 支持按钮 */}
        <Button variant="ghost" size="sm" className="btn-ghost text-red-500 hover:text-red-600">
          <Heart className="w-4 h-4 mr-1" />
          支持
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
