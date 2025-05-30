
import React from 'react';
import { Share2 } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CodeFormat } from '../../pages/Index';

interface ShareDialogHeaderProps {
  format: CodeFormat;
}

const ShareDialogHeader: React.FC<ShareDialogHeaderProps> = ({ format }) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Share2 className="w-5 h-5 text-brand-primary" />
        <span>分享你的作品</span>
      </DialogTitle>
      <DialogDescription>
        生成分享链接，让其他人可以查看你的 {format.toUpperCase()} 代码和预览效果
      </DialogDescription>
    </DialogHeader>
  );
};

export default ShareDialogHeader;
