
import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShareUrlSectionProps {
  shareUrl: string;
  isGenerating: boolean;
  copied: boolean;
  onCopyToClipboard: () => void;
}

const ShareUrlSection: React.FC<ShareUrlSectionProps> = ({
  shareUrl,
  isGenerating,
  copied,
  onCopyToClipboard
}) => {
  return (
    <div className="space-y-3">
      {isGenerating ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">正在保存草稿...</p>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">草稿保存成功！</p>
              <p className="text-xs text-green-600 mt-1">
                你可以在个人资料页面的"草稿"标签中找到并管理这个草稿
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareUrlSection;
