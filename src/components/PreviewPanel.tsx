
import React, { useEffect, useRef, useState } from 'react';
import { CodeFormat } from '../pages/Index';
import { Maximize2, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PreviewPanelProps {
  code: string;
  format: CodeFormat;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, format }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderPreview = () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!iframeRef.current) return;

      const iframe = iframeRef.current;
      const doc = iframe.contentDocument;
      
      if (!doc) return;

      switch (format) {
        case 'html':
          doc.open();
          doc.write(code || '<div style="padding: 40px; text-align: center; color: #666;">请在左侧输入 HTML 代码</div>');
          doc.close();
          break;

        case 'markdown':
          // 简单的 Markdown 渲染
          const markdownToHtml = (md: string) => {
            return md
              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
              .replace(/\*(.*)\*/gim, '<em>$1</em>')
              .replace(/`([^`]+)`/gim, '<code>$1</code>')
              .replace(/```([^```]+)```/gim, '<pre><code>$1</code></pre>')
              .replace(/^\* (.*$)/gim, '<li>$1</li>')
              .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
              .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
              .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
              .replace(/\n/gim, '<br>');
          };

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
                }
                h1, h2, h3 { color: #2563eb; margin-top: 1.5em; }
                h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.3em; }
                code { 
                  background: #f3f4f6; 
                  padding: 2px 4px; 
                  border-radius: 3px; 
                  font-family: 'JetBrains Mono', monospace;
                }
                pre { 
                  background: #1f2937; 
                  color: #f9fafb; 
                  padding: 16px; 
                  border-radius: 8px; 
                  overflow-x: auto;
                }
                blockquote { 
                  border-left: 4px solid #6366f1; 
                  margin: 16px 0; 
                  padding-left: 16px; 
                  color: #6b7280;
                }
                a { color: #6366f1; text-decoration: none; }
                a:hover { text-decoration: underline; }
                li { margin: 4px 0; }
              </style>
            </head>
            <body>
              ${code ? markdownToHtml(code) : '<p style="text-align: center; color: #666;">请在左侧输入 Markdown 内容</p>'}
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
              ${code || '<p style="text-align: center; color: #666;">请在左侧输入 SVG 代码</p>'}
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
                ${code || 'graph TD\nA[请在左侧输入 Mermaid 代码] --> B[实时预览]'}
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
    } catch (err) {
      setError(`渲染错误: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      renderPreview();
    }, 300); // 防抖处理

    return () => clearTimeout(timer);
  }, [code, format]);

  const handleRefresh = () => {
    renderPreview();
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      iframeRef.current.requestFullscreen();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 预览面板头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Eye className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">
            实时预览
          </span>
          <span className="text-xs text-gray-500 capitalize bg-gray-200 px-2 py-1 rounded">
            {format}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isLoading && (
            <RefreshCw className="w-4 h-4 text-brand-primary animate-spin" />
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="btn-ghost"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFullscreen}
            className="btn-ghost"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* 预览内容区域 */}
      <div className="flex-1 relative bg-white">
        {error ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                渲染出错
              </h3>
              <p className="text-sm text-gray-600 max-w-md">
                {error}
              </p>
              <Button
                onClick={handleRefresh}
                className="mt-4 btn-secondary"
                size="sm"
              >
                重试
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            className="preview-panel"
            title="代码预览"
            sandbox="allow-scripts allow-same-origin"
          />
        )}
        
        {/* 加载指示器 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-brand-primary animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">正在渲染...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 预览面板底部状态栏 */}
      <div className="p-2 bg-gray-50 text-xs text-gray-500 flex items-center justify-between border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <span>自动刷新</span>
          <span>安全沙箱</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="status-indicator status-success"></div>
          <span>预览就绪</span>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
