
import React, { useState, useEffect } from 'react';
import { CodeFormat } from '../pages/Index';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
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
  existingPageId?: string | null;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  code,
  format,
  existingPageId
}) => {
  const { user } = useAuth();
  const [shareUrl, setShareUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareId, setShareId] = useState('');
  const [password, setPassword] = useState('');
  const [usePassword, setUsePassword] = useState(false);

  const generateShareUrl = async () => {
    setIsGenerating(true);

    try {
      console.log('Saving draft with format:', format);

      if (!user) {
        throw new Error('用户未登录');
      }

      // 保存或更新草稿
      let data, error;
      
      if (existingPageId) {
        // 更新现有草稿
        const result = await supabase
          .from('render_pages')
          .update({
            title: `${format.toUpperCase()} 草稿`,
            description: `通过 HTML-Go 创建的 ${format} 草稿`,
            html_content: code,
            code_type: format,
            is_protected: !!usePassword,
            password: usePassword ? password : null,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPageId)
          .eq('user_id', user.id)
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      } else {
        // 创建新草稿
        const result = await supabase
          .from('render_pages')
          .insert({
            user_id: user.id,
            title: `${format.toUpperCase()} 草稿`,
            description: `通过 HTML-Go 创建的 ${format} 草稿`,
            html_content: code,
            code_type: format,
            status: 'draft', // 明确设置为草稿状态
            is_protected: !!usePassword,
            password: usePassword ? password : null
          })
          .select()
          .single();
        
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Database error:', error);
        throw new Error(`保存草稿失败: ${error.message}`);
      }

      console.log('Successfully saved draft:', data);

      // 验证保存的状态
      if (data.status !== 'draft') {
        console.warn('Warning: Draft was not saved with draft status:', data.status);
      }

      setShareId(data.id);
      setShareUrl(`/profile?tab=draft`); // 设置为草稿箱链接

      toast({
        title: existingPageId ? "草稿已更新" : "草稿已保存",
        description: existingPageId 
          ? "你的草稿内容已成功更新！"
          : "你的代码已保存到草稿箱，可以在个人资料中管理和发布！",
      });

    } catch (error: unknown) {
      console.error('Error saving draft:', error);
      const message = error instanceof Error ? error.message : "无法保存草稿，请重试";
      toast({
        title: "保存失败",
        description: message,
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
