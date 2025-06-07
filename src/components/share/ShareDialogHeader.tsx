
import React from 'react';
import { Save } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CodeFormat } from '../../pages/Index';

interface ShareDialogHeaderProps {
  format: CodeFormat;
}

const ShareDialogHeader: React.FC<ShareDialogHeaderProps> = ({ format }) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Save className="w-5 h-5 text-brand-primary" />
        <span>保存到草稿箱</span>
      </DialogTitle>
      <DialogDescription>
        将你的 {format.toUpperCase()} 代码保存到个人草稿箱，稍后可以编辑和发布
      </DialogDescription>
    </DialogHeader>
  );
};

export default ShareDialogHeader;
