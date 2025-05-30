
import React from 'react';
import { Download, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { CodeFormat } from '../../pages/Index';

interface ShareActionsProps {
  shareUrl: string;
  shareId: string;
  code: string;
  format: CodeFormat;
}

const ShareActions: React.FC<ShareActionsProps> = ({
  shareUrl,
  shareId,
  code,
  format
}) => {
  const downloadCode = () => {
    const extensions = {
      html: 'html',
      markdown: 'md',
      svg: 'svg',
      mermaid: 'mmd'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `html-go-${shareId || 'code'}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "文件已下载",
      description: `${format.toUpperCase()} 文件已保存到你的设备`,
    });
  };

  const showQrCode = () => {
    toast({
      title: "二维码功能",
      description: "二维码分享功能开发中...",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        onClick={downloadCode}
        variant="outline"
        className="btn-secondary"
        disabled={!shareUrl}
      >
        <Download className="w-4 h-4 mr-2" />
        下载文件
      </Button>
      
      <Button
        onClick={showQrCode}
        variant="outline"
        className="btn-secondary"
        disabled={!shareUrl}
      >
        <QrCode className="w-4 h-4 mr-2" />
        二维码
      </Button>
    </div>
  );
};

export default ShareActions;
