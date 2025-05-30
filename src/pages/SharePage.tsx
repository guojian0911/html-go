
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Eye, Download, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ShareData {
  id: string;
  content: string;
  createdAt: number;
  codeType: string;
  isProtected: boolean;
}

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchShareData = async (inputPassword?: string) => {
    if (!id) {
      setError('分享 ID 不存在');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching share data for ID:', id);
      
      // 构建请求参数
      const requestBody: any = { id };
      if (inputPassword) {
        requestBody.password = inputPassword;
      }

      const { data, error: functionError } = await supabase.functions.invoke('get-share', {
        body: requestBody
      });

      if (functionError) {
        console.error('Supabase function error:', functionError);
        throw new Error(functionError.message || '调用分享服务失败');
      }

      if (!data.success) {
        if (data.requiresPassword) {
          setRequiresPassword(true);
          setError('需要密码访问此分享');
        } else {
          setError(data.error || '无法加载分享内容');
        }
        return;
      }

      setShareData(data.data);
      setRequiresPassword(false);

    } catch (err) {
      console.error('Error fetching share data:', err);
      setError('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = () => {
    if (!password.trim()) {
      toast({
        title: "请输入密码",
        variant: "destructive",
      });
      return;
    }
    fetchShareData(password);
  };

  const copyCode = async () => {
    if (!shareData) return;
    
    try {
      await navigator.clipboard.writeText(shareData.content);
      setCopied(true);
      
      toast({
        title: "代码已复制",
        description: "代码已复制到剪贴板",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制代码",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    if (!shareData) return;

    const extensions = {
      html: 'html',
      markdown: 'md',
      svg: 'svg',
      mermaid: 'mmd'
    };
    
    const blob = new Blob([shareData.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shared-${shareData.id}.${extensions[shareData.codeType as keyof typeof extensions] || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "文件已下载",
      description: "代码文件已保存到你的设备",
    });
  };

  const renderPreview = () => {
    if (!shareData) return null;

    if (shareData.codeType === 'html') {
      return (
        <iframe
          srcDoc={shareData.content}
          className="w-full h-full border-0"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      );
    }

    return (
      <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-50 rounded-lg overflow-auto h-full">
        {shareData.content}
      </pre>
    );
  };

  useEffect(() => {
    fetchShareData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载分享内容中...</p>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-900 mb-2">需要密码访问</h1>
            <p className="text-gray-600">此分享受密码保护，请输入密码查看内容</p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="请输入访问密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            
            <Button 
              onClick={handlePasswordSubmit}
              className="w-full"
              disabled={!password.trim()}
            >
              访问分享
            </Button>
          </div>
          
          {error && (
            <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
          )}
        </div>
      </div>
    );
  }

  if (error && !requiresPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">加载失败</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => fetchShareData()}>重试</Button>
        </div>
      </div>
    );
  }

  if (!shareData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">分享不存在</h1>
          <p className="text-gray-600">找不到指定的分享内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部工具栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">
              分享的 {shareData.codeType.toUpperCase()} 代码
            </h1>
            <span className="text-sm text-gray-500">
              ID: {shareData.id}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={copyCode}
              variant="outline"
              size="sm"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-2 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 mr-2" />
              )}
              复制代码
            </Button>
            
            <Button
              onClick={downloadCode}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              下载
            </Button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* 代码区域 */}
        <div className="w-1/2 bg-white border-r border-gray-200">
          <div className="h-full p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">源代码</h2>
              <span className="text-sm text-gray-500">
                {shareData.content.length} 字符，{shareData.content.split('\n').length} 行
              </span>
            </div>
            
            <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-50 rounded-lg overflow-auto h-[calc(100%-60px)]">
              {shareData.content}
            </pre>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="w-1/2 bg-white">
          <div className="h-full p-4">
            <div className="flex items-center mb-4">
              <Eye className="w-5 h-5 mr-2 text-gray-600" />
              <h2 className="font-semibold text-gray-900">预览效果</h2>
            </div>
            
            <div className="h-[calc(100%-60px)] border border-gray-200 rounded-lg overflow-hidden">
              {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharePage;
