
import React from 'react';
import { Share2, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TopToolbarProps {
  onShare: () => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ onShare }) => {
  const navigate = useNavigate();

  return (
    <div className="toolbar h-16 flex items-center justify-between px-6">
      {/* 左侧 - 返回按钮 + Logo 和标题 */}
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回首页
        </Button>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-info rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">
              HTML-Go 编辑器
            </h1>
            <p className="text-xs text-gray-500">创建和编辑你的作品</p>
          </div>
        </div>
        
        {/* 状态指示器 */}
        <div className="flex items-center space-x-2 ml-6">
          <div className="status-indicator status-success"></div>
          <span className="text-sm text-gray-600">就绪</span>
        </div>
      </div>
      
      {/* 右侧 - 分享按钮 */}
      <div className="flex items-center space-x-3">
        <Button 
          onClick={onShare}
          className="btn-primary btn-hover"
          size="sm"
        >
          <Share2 className="w-4 h-4 mr-2" />
          分享
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
