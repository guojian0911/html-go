
import React from 'react';
import { Save, FileText, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TopToolbarProps {
  onShare: () => void;
  onShareLink?: () => void;
  showShareLink?: boolean;
}

const TopToolbar: React.FC<TopToolbarProps> = ({ 
  onShare, 
  onShareLink, 
  showShareLink = false 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageId = searchParams.get('id');
  const isEditMode = !!pageId; // 如果有ID参数，则为编辑模式

  return (
    <div className="toolbar h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm">
      {/* Left side - Logo and title with improved contrast and interaction */}
      <div className="flex items-center space-x-4">
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 rounded-lg p-2 -m-2"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigate('/');
            }
          }}
          aria-label="返回首页"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-info rounded-lg flex items-center justify-center shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-display">
              HTML-Go 编辑器
            </h1>
            <p className="text-xs text-gray-600">创建和编辑你的作品</p>
          </div>
        </div>
        
        {/* Status indicator with improved accessibility */}
        <div className="flex items-center space-x-2 ml-6">
          <div 
            className="status-indicator status-success" 
            role="status" 
            aria-label="系统状态：就绪"
          ></div>
          <span className="text-sm text-gray-700 font-medium">就绪</span>
        </div>
      </div>
      
      {/* Right side - Action buttons with enhanced styling */}
      <div className="flex items-center space-x-3">
        {showShareLink && onShareLink && (
          <Button
            onClick={onShareLink}
            variant="outline"
            className="font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 shadow-sm hover:shadow-md"
            size="sm"
            aria-label="分享当前作品"
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享作品
          </Button>
        )}
        <Button
          onClick={onShare}
          className="bg-brand-primary hover:bg-brand-primary-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 shadow-sm hover:shadow-md"
          size="sm"
          aria-label={isEditMode ? "保存当前更改" : "保存当前作品到草稿箱"}
        >
          <Save className="w-4 h-4 mr-2" />
          {isEditMode ? '保存' : '保存草稿'}
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
