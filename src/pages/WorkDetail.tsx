
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Eye, Calendar, Copy, Download, Edit3, Code2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { marked } from 'marked';

type CodeFormat = 'html' | 'markdown' | 'svg' | 'mermaid';

interface Work {
  id: string;
  title: string;
  description: string;
  format: CodeFormat;
  viewCount: number;
  createdAt: string;
  content: string;
}

const WorkDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showSourceCode, setShowSourceCode] = useState(false);

  // 模拟数据 - 实际项目中这里会从数据库获取
  const mockWork: Work = {
    id: id || '1',
    title: '响应式导航栏设计',
    description: '一个现代化的响应式导航栏，支持移动端适配，包含了下拉菜单、移动端汉堡菜单等功能。',
    format: 'html',
    viewCount: 234,
    createdAt: '2024-01-15',
    content: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>响应式导航栏</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
        }
        
        .navbar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1rem 0;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
        }
        
        .nav-menu {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-link {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .nav-link:hover {
            color: #ffd700;
        }
        
        .main-content {
            margin-top: 80px;
            padding: 2rem;
            min-height: 100vh;
            background: linear-gradient(45deg, #f0f2f5, #e6e9f0);
        }
        
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                flex-direction: column;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background: rgba(102, 126, 234, 0.95);
                backdrop-filter: blur(10px);
                display: none;
            }
            
            .nav-menu.active {
                display: flex;
                padding: 1rem 0;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <a href="#" class="logo">Brand</a>
            <ul class="nav-menu">
                <li><a href="#" class="nav-link">首页</a></li>
                <li><a href="#" class="nav-link">产品</a></li>
                <li><a href="#" class="nav-link">服务</a></li>
                <li><a href="#" class="nav-link">关于</a></li>
                <li><a href="#" class="nav-link">联系</a></li>
            </ul>
        </div>
    </nav>
    
    <main class="main-content">
        <section class="hero">
            <h1>现代化响应式导航栏</h1>
            <p>适配各种设备尺寸，提供优雅的用户体验</p>
        </section>
    </main>
</body>
</html>`
  };

  useEffect(() => {
    if (iframeRef.current && mockWork) {
      updatePreview();
    }
  }, [mockWork]);

  const updatePreview = () => {
    if (!iframeRef.current || !mockWork) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    
    if (!iframeDoc) return;

    let content = '';
    
    switch (mockWork.format) {
      case 'html':
        content = mockWork.content;
        break;
      case 'markdown':
        content = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1, h2, h3 { color: #333; }
                code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
                pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
                blockquote { border-left: 4px solid #ddd; margin: 0; padding: 0 15px; color: #666; }
              </style>
            </head>
            <body>${marked(mockWork.content)}</body>
          </html>
        `;
        break;
      case 'svg':
        content = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <style>body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }</style>
            </head>
            <body>${mockWork.content}</body>
          </html>
        `;
        break;
      case 'mermaid':
        content = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
              <style>body { font-family: Arial, sans-serif; padding: 20px; }</style>
            </head>
            <body>
              <div class="mermaid">${mockWork.content}</div>
              <script>mermaid.initialize({startOnLoad:true});</script>
            </body>
          </html>
        `;
        break;
    }

    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(mockWork.content);
      toast({
        title: "复制成功",
        description: "代码已复制到剪贴板",
      });
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制代码",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const extensions: Record<CodeFormat, string> = {
      html: 'html',
      markdown: 'md',
      svg: 'svg',
      mermaid: 'mmd'
    };
    
    const blob = new Blob([mockWork.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mockWork.title}.${extensions[mockWork.format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "下载成功",
      description: "文件已保存到本地",
    });
  };

  const handleEditInEditor = () => {
    // 这里可以通过URL参数传递内容到编辑器
    navigate(`/editor?content=${encodeURIComponent(mockWork.content)}&format=${mockWork.format}`);
  };

  if (!mockWork) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">作品不存在</h2>
          <p className="text-gray-600 mb-4">您访问的作品可能已被删除或不存在</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧 - 返回和标题 */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{mockWork.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <Badge variant="outline">
                    {mockWork.format.toUpperCase()}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{mockWork.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{mockWork.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧 - 操作按钮 */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSourceCode(!showSourceCode)}
              >
                <Code2 className="w-4 h-4 mr-2" />
                {showSourceCode ? '隐藏源码' : '查看源码'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
              >
                <Copy className="w-4 h-4 mr-2" />
                复制
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                下载
              </Button>
              <Button
                size="sm"
                onClick={handleEditInEditor}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                在编辑器中打开
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="h-[calc(100vh-64px)]">
        {showSourceCode ? (
          // 源码查看模式
          <div className="h-full flex">
            <div className="w-1/2 p-6 bg-white border-r">
              <h3 className="text-lg font-semibold mb-4">源代码</h3>
              <pre className="whitespace-pre-wrap font-mono text-sm p-4 bg-gray-50 rounded-lg overflow-auto h-[calc(100%-60px)]">
                {mockWork.content}
              </pre>
            </div>
            <div className="w-1/2 p-6">
              <h3 className="text-lg font-semibold mb-4">预览效果</h3>
              <div className="h-[calc(100%-60px)] border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  ref={iframeRef}
                  className="w-full h-full border-0"
                  title={mockWork.title}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </div>
          </div>
        ) : (
          // 全屏预览模式
          <div className="h-full">
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0 bg-white"
              title={mockWork.title}
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkDetail;
