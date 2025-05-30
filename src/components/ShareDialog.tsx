
import React, { useState, useEffect } from 'react';
import { CodeFormat } from '../pages/Index';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Copy, 
  Check, 
  Share2, 
  QrCode, 
  Download,
  Globe,
  Lock,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  code: string;
  format: CodeFormat;
}

const ShareDialog: React.FC<ShareDialogProps> = ({ 
  isOpen, 
  onClose, 
  code, 
  format 
}) => {
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);

  // 生成分享链接
  const generateShareUrl = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Creating share with format:', format);
      
      const { data, error } = await supabase.functions.invoke('create-share', {
        body: {
          code,
          format,
          password: usePassword ? password : null
        }
      });

      if (error) {
        console.error('Error creating share:', error);
        throw new Error(error.message || 'Failed to create share');
      }

      if (data?.success) {
        setShareId(data.shareId);
        setShareUrl(data.shareUrl);
        
        toast({
          title: "分享链接已生成",
          description: "你的代码已保存，可以分享给任何人查看！",
        });
      } else {
        throw new Error(data?.error || 'Failed to create share');
      }

    } catch (error) {
      console.error('Error generating share URL:', error);
      toast({
        title: "生成失败",
        description: error.message || "无法生成分享链接，请重试",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // 复制到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      toast({
        title: "已复制到剪贴板",
        description: "分享链接已复制，可以粘贴到任何地方！",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制链接",
        variant: "destructive",
      });
    }
  };

  // 下载代码文件
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

  useEffect(() => {
    if (isOpen && !shareUrl) {
      generateShareUrl();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setShareUrl('');
      setShareId('');
      setCopied(false);
      setPassword('');
      setUsePassword(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-brand-primary" />
            <span>分享你的作品</span>
          </DialogTitle>
          <DialogDescription>
            生成分享链接，让其他人可以查看你的 {format.toUpperCase()} 代码和预览效果
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 代码信息卡片 */}
          <div className="card-modern p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-info rounded-lg flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">代码快照</h4>
                  <p className="text-xs text-gray-500">{format.toUpperCase()} 格式</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-mono text-gray-600">{code.length} 字符</p>
                <p className="text-xs text-gray-500">{code.split('\n').length} 行</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>安全加密</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>永久保存</span>
              </div>
            </div>
          </div>

          {/* 密码保护选项 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="usePassword"
                checked={usePassword}
                onChange={(e) => setUsePassword(e.target.checked)}
                className="rounded border-gray-300"
                disabled={isGenerating || Boolean(shareUrl)}
              />
              <label htmlFor="usePassword" className="text-sm font-medium text-gray-700">
                使用密码保护
              </label>
            </div>
            
            {usePassword && (
              <Input
                type="password"
                placeholder="设置访问密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isGenerating || Boolean(shareUrl)}
                className="text-sm"
              />
            )}
          </div>
          
          {/* 分享链接区域 */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              分享链接
            </label>
            
            {isGenerating ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">正在生成分享链接...</p>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="font-mono text-sm"
                  placeholder="生成中..."
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="flex-shrink-0"
                  disabled={!shareUrl}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
          
          {/* 操作按钮组 */}
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
              onClick={() => {
                toast({
                  title: "二维码功能",
                  description: "二维码分享功能开发中...",
                });
              }}
              variant="outline"
              className="btn-secondary"
              disabled={!shareUrl}
            >
              <QrCode className="w-4 h-4 mr-2" />
              二维码
            </Button>
          </div>
          
          {/* 分享提示 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs font-bold">i</span>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium">分享说明</p>
                <p className="text-xs text-blue-600 mt-1">
                  分享链接包含完整的代码和预览效果，{usePassword ? '需要密码才能' : '任何人都可以通过链接'}查看。
                  代码将永久保存在服务器上。
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
