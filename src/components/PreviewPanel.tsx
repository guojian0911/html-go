import React, { useEffect, useRef, useState } from 'react';
import { CodeFormat } from '../pages/Index';
import { Maximize2, RefreshCw, Eye, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';

interface PreviewPanelProps {
  code: string;
  format: CodeFormat;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ code, format }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 配置 marked 选项
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

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
          // 使用 marked 库进行 Markdown 渲染
          const markdownHtml = code ? marked(code) : '<p style="text-align: center; color: #666;">请在左侧输入 Markdown 内容</p>';
          
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
                
                /* 标题样式 */
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
                
                /* 段落和文本 */
                p { margin: 1em 0; }
                strong { font-weight: 600; color: #374151; }
                em { font-style: italic; color: #6b7280; }
                
                /* 代码样式 */
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
                
                /* 引用块 */
                blockquote { 
                  border-left: 4px solid #6366f1; 
                  margin: 16px 0; 
                  padding: 8px 16px; 
                  background: #f8fafc;
                  color: #4b5563;
                  border-radius: 0 4px 4px 0;
                }
                
                /* 链接 */
                a { 
                  color: #6366f1; 
                  text-decoration: none; 
                  border-bottom: 1px solid transparent;
                  transition: border-color 0.2s;
                }
                a:hover { 
                  border-bottom-color: #6366f1;
                }
                
                /* 列表 */
                ul, ol { 
                  margin: 1em 0; 
                  padding-left: 2em;
                }
                li { 
                  margin: 4px 0; 
                  line-height: 1.6;
                }
                
                /* 表格 */
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
                
                /* 分割线 */
                hr {
                  border: none;
                  height: 2px;
                  background: linear-gradient(to right, #e5e7eb, #d1d5db, #e5e7eb);
                  margin: 2em 0;
                  border-radius: 1px;
                }
                
                /* 图片 */
                img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  margin: 1em 0;
                }
                
                /* 任务列表 */
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* 预览面板头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
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
      <div className="flex-1 relative bg-white overflow-hidden">
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
            className="w-full h-full border-0"
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
      <div className="p-2 bg-gray-50 text-xs text-gray-500 flex items-center justify-between border-t border-gray-200 flex-shrink-0">
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
