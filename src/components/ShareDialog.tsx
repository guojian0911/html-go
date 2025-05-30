
import React, { useState, useEffect } from 'react';
import { CodeFormat } from '../pages/Index';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ShareDialogHeader from './share/ShareDialogHeader';
import CodeInfoCard from './share/CodeInfoCard';
import PasswordSection from './share/PasswordSection';
import ShareUrlSection from './share/ShareUrlSection';
import ShareActions from './share/ShareActions';
import ShareInfo from './share/ShareInfo';

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
        <ShareDialogHeader format={format} />
        
        <div className="space-y-6">
          <CodeInfoCard code={code} format={format} />

          <PasswordSection
            usePassword={usePassword}
            password={password}
            isGenerating={isGenerating}
            shareUrl={shareUrl}
            onUsePasswordChange={setUsePassword}
            onPasswordChange={setPassword}
          />
          
          <ShareUrlSection
            shareUrl={shareUrl}
            isGenerating={isGenerating}
            copied={copied}
            onCopyToClipboard={copyToClipboard}
          />
          
          <ShareActions
            shareUrl={shareUrl}
            shareId={shareId}
            code={code}
            format={format}
          />
          
          <ShareInfo usePassword={usePassword} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
