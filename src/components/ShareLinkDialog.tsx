import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink, Globe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pageId: string;
  title: string;
  codeType: string;
}

const ShareLinkDialog: React.FC<ShareLinkDialogProps> = ({
  isOpen,
  onClose,
  pageId,
  title,
  codeType
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isUpdatingShareCount, setIsUpdatingShareCount] = useState(false);

  // 生成分享链接
  useEffect(() => {
    if (isOpen && pageId) {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/share/${pageId}?preview=true`;
      setShareUrl(url);
    }
  }, [isOpen, pageId]);

  // 复制链接到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "链接已复制",
        description: "分享链接已复制到剪贴板！",
      });
      
      // 增加分享数
      await incrementShareCount();
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制链接",
        variant: "destructive",
      });
    }
  };

  // 在新标签页打开预览
  const openPreview = async () => {
    window.open(shareUrl, '_blank');
    
    // 增加分享数
    await incrementShareCount();
    
    toast({
      title: "已打开预览",
      description: "作品预览已在新标签页中打开",
    });
  };

  // 增加分享数
  const incrementShareCount = async () => {
    if (isUpdatingShareCount) return;
    
    setIsUpdatingShareCount(true);
    try {
      // 先获取当前的分享数
      const { data: currentData, error: fetchError } = await supabase
        .from('render_pages')
        .select('share_count')
        .eq('id', pageId)
        .single();

      if (fetchError) {
        console.error('Error fetching current share count:', fetchError);
        return;
      }

      // 增加分享数
      const newShareCount = (currentData?.share_count || 0) + 1;
      const { error } = await supabase
        .from('render_pages')
        .update({ share_count: newShareCount })
        .eq('id', pageId);

      if (error) {
        console.error('Error updating share count:', error);
        // 静默失败，不影响用户体验
      }
    } catch (err) {
      console.error('Error incrementing share count:', err);
    } finally {
      setIsUpdatingShareCount(false);
    }
  };

  // 关闭弹框时重置状态
  const handleClose = () => {
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-500" />
            <span>分享作品</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 作品信息 */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">
                {codeType.toUpperCase().charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate mb-1">{title}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {codeType.toUpperCase()}
                </Badge>
                <span className="text-xs text-gray-500">
                  即时预览链接
                </span>
              </div>
            </div>
          </div>

          {/* 分享链接 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              分享链接
            </label>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1 font-mono text-sm bg-gray-50"
                placeholder="生成中..."
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="sm"
                className="flex items-center space-x-1 min-w-[80px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-3">
            <Button
              onClick={openPreview}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>预览作品</span>
            </Button>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>复制链接</span>
            </Button>
          </div>

          {/* 提示信息 */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">分享须知</p>
                <ul className="text-xs text-blue-600 mt-1 space-y-1">
                  <li>• 分享链接将直接展示作品内容</li>
                  <li>• 接收者无需注册即可查看</li>
                  <li>• 每次分享操作将增加作品的分享数</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareLinkDialog; 