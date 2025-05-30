
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Download, Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { marked } from 'marked';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 配置 marked 选项
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

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
    if (!shareData || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;
    
    if (!doc) return;

    switch (shareData.codeType) {
      case 'html':
        doc.open();
        doc.write(shareData.content || '<div style="padding: 40px; text-align: center; color: #666;">暂无内容</div>');
        doc.close();
        break;

      case 'markdown':
        const markdownHtml = shareData.content ? marked(shareData.content) : '<p style="text-align: center; color: #666;">暂无内容</p>';
        
        const htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: white;
              }
              
              h1, h2, h3, h4, h5, h6 { 
                color: #2563eb; 
                margin-top: 1.5em;
                margin-bottom: 0.5em;
                font-weight: 600;
              }
              h1 { 
                border-bottom: 2px solid #e5e7eb; 
                padding-bottom: 0.3em; 
                font-size: 2em;
              }
              h2 { font-size: 1.5em; }
              h3 { font-size: 1.25em; }
              
              p { margin: 1em 0; }
              strong { font-weight: 600; color: #374151; }
              em { font-style: italic; color: #6b7280; }
              
              code { 
                background: #f3f4f6; 
                padding: 2px 6px; 
                border-radius: 4px; 
                font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
                font-size: 0.9em;
                color: #dc2626;
              }
              
              pre { 
                background: #1f2937; 
                color: #f9fafb; 
                padding: 16px; 
                border-radius: 8px; 
                overflow-x: auto;
                margin: 1em 0;
                border: 1px solid #374151;
              }
              
              pre code {
                background: none;
                padding: 0;
                color: inherit;
                font-size: 0.875em;
              }
              
              blockquote { 
                border-left: 4px solid #6366f1; 
                margin: 16px 0; 
                padding: 8px 16px; 
                background: #f8fafc;
                color: #4b5563;
                border-radius: 0 4px 4px 0;
              }
              
              a { 
                color: #6366f1; 
                text-decoration: none; 
                border-bottom: 1px solid transparent;
                transition: border-color 0.2s;
              }
              a:hover { 
                border-bottom-color: #6366f1;
              }
              
              ul, ol { 
                margin: 1em 0; 
                padding-left: 2em;
              }
              li { 
                margin: 4px 0; 
                line-height: 1.6;
              }
              
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1em 0;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              }
              
              th, td {
                border: 1px solid #e5e7eb;
                padding: 12px 16px;
                text-align: left;
              }
              
              th {
                background: #f9fafb;
                font-weight: 600;
                color: #374151;
              }
              
              tr:nth-child(even) td {
                background: #f9fafb;
              }
              
              tr:hover td {
                background: #f3f4f6;
              }
              
              hr {
                border: none;
                height: 2px;
                background: linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb);
                margin: 2em 0;
                border-radius: 1px;
              }
              
              img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                margin: 1em 0;
              }
              
              input[type="checkbox"] {
                margin-right: 8px;
              }
            </style>
          </head>
          <body>
            ${markdownHtml}
          </body>
          </html>
        `;
        
        doc.open();
        doc.write(htmlContent);
        doc.close();
        break;

      case 'svg':
        const svgHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: calc(100vh - 40px);
                background: #f8fafc;
              }
              svg {
                max-width: 100%;
                max-height: 100%;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            ${shareData.content || '<p style="text-align: center; color: #666;">暂无内容</p>'}
          </body>
          </html>
        `;
        
        doc.open();
        doc.write(svgHtml);
        doc.close();
        break;

      case 'mermaid':
        const mermaidHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: 'Inter', sans-serif;
                background: #f8fafc;
              }
              .mermaid {
                text-align: center;
                background: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <div class="mermaid">
              ${shareData.content || 'graph TD\nA[暂无内容] --> B[请添加 Mermaid 代码]'}
            </div>
            <script>
              mermaid.initialize({ 
                startOnLoad: true,
                theme: 'default',
                themeVariables: {
                  primaryColor: '#6366f1',
                  primaryTextColor: '#ffffff',
                  primaryBorderColor: '#4f46e5',
                  lineColor: '#374151',
                  sectionBkgColor: '#f3f4f6',
                  altSectionBkgColor: '#ffffff',
                  gridColor: '#e5e7eb'
                }
              });
            </script>
          </body>
          </html>
        `;
        
        doc.open();
        doc.write(mermaidHtml);
        doc.close();
        break;
    }
  };

  useEffect(() => {
    fetchShareData();
  }, [id]);

  useEffect(() => {
    if (shareData) {
      const timer = setTimeout(() => {
        renderPreview();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [shareData]);

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
              分享的 {shareData.codeType.toUpperCase()} 内容
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

      {/* 预览内容区域 - 全屏显示 */}
      <div className="h-[calc(100vh-73px)]">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0 bg-white"
          title="分享内容预览"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
};

export default SharePage;
