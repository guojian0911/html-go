import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { PagesService } from '@/services/PagesService';
import TopToolbar from '../components/TopToolbar';
import CodeEditor from '../components/CodeEditor';
import PreviewPanel from '../components/PreviewPanel';
import FormatSelector from '../components/FormatSelector';
import ShareDialog from '../components/ShareDialog';
import ShareLinkDialog from '../components/ShareLinkDialog';

export type CodeFormat = 'html' | 'markdown' | 'svg' | 'mermaid';

const Editor = () => {
  const [code, setCode] = useState('');
  const [format, setFormat] = useState<CodeFormat>('html');
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isShareLinkDialogOpen, setIsShareLinkDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [pageTitle, setPageTitle] = useState('');
  
  const pageId = searchParams.get('id');
  const isEditMode = !!pageId; // 如果有ID参数，则为编辑模式

  // 加载草稿数据
  const loadDraftData = async (id: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await PagesService.getPageById(id, user.id);

      if (!result.success) {
        console.error('Error loading draft:', result.error);
        toast({
          title: "加载失败",
          description: "无法加载草稿内容",
          variant: "destructive",
        });
        return;
      }

      if (result.data) {
        setCode(result.data.html_content);
        setFormat(result.data.code_type as CodeFormat);
        setPageTitle(result.data.title || '');
        
        toast({
          title: "草稿已加载",
          description: "草稿内容已载入编辑器",
        });
      }
    } catch (err) {
      console.error('Error loading draft:', err);
      toast({
        title: "加载失败",
        description: "加载草稿时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 保存现有草稿的更新
  const saveExistingDraft = async () => {
    if (!user || !pageId) return;

    setIsLoading(true);
    try {
      const result = await PagesService.updatePageContent(pageId, user.id, code);

      if (!result.success) {
        console.error('Error updating draft:', result.error);
        toast({
          title: "保存失败",
          description: "无法保存更改",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "保存成功",
        description: "您的更改已保存",
      });
    } catch (err) {
      console.error('Error saving draft:', err);
      toast({
        title: "保存失败",
        description: "保存时发生错误",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 页面加载时检查是否需要加载草稿
  useEffect(() => {
    if (pageId && user) {
      loadDraftData(pageId);
    } else if (!pageId) {
      // 如果没有 ID 参数，设置默认的示例代码
      setDefaultExampleCode();
    }
  }, [pageId, user]);

  const setDefaultExampleCode = () => {
    const examples = {
      html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML 示例</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .highlight {
            background: linear-gradient(120deg, #a855f7 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>欢迎使用 <span class="highlight">HTML-Go</span>!</h1>
    <div class="card">
        <h2>🚀 特性介绍</h2>
        <ul>
            <li>支持多种代码格式</li>
            <li>实时预览渲染效果</li>
            <li>一键生成分享链接</li>
            <li>现代化的用户界面</li>
        </ul>
    </div>
    <div class="card">
        <p>在左侧编辑器中输入你的代码，右侧将实时显示渲染效果。</p>
        <button onclick="alert('Hello from HTML-Go!')" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">点击测试</button>
    </div>
</body>
</html>`,
      markdown: `# Welcome to HTML-Go! 🚀`,
      svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">...</svg>`,
      mermaid: `graph TD\n    A[HTML-Go] --> B[开始编辑]`
    };
    setCode(examples[format]);
  };

  const handleFormatChange = (newFormat: CodeFormat) => {
    setFormat(newFormat);
    
    // 只有在创建新内容时（没有 pageId）才显示示例代码
    // 如果正在编辑现有草稿，则保持当前代码不变
    if (!pageId) {
      const examples = {
        html: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML 示例</title>
    <style>
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .highlight {
            background: linear-gradient(120deg, #a855f7 0%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .card {
            background: white;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>欢迎使用 <span class="highlight">HTML-Go</span>!</h1>
    <div class="card">
        <h2>🚀 特性介绍</h2>
        <ul>
            <li>支持多种代码格式</li>
            <li>实时预览渲染效果</li>
            <li>一键生成分享链接</li>
            <li>现代化的用户界面</li>
        </ul>
    </div>
    <div class="card">
        <p>在左侧编辑器中输入你的代码，右侧将实时显示渲染效果。</p>
        <button onclick="alert('Hello from HTML-Go!')" style="background: #6366f1; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">点击测试</button>
    </div>
</body>
</html>`,
        markdown: `# Welcome to HTML-Go! 🚀

HTML-Go 是一个现代化的多格式渲染分享平台，让你轻松预览和分享你的代码作品。

## ✨ 支持的格式

### 📝 Markdown
- **粗体文字** 和 *斜体文字*
- \`内联代码\` 和代码块
- 列表和表格
- 链接和图片

### 🎨 其他格式
1. **HTML** - 完整的网页文档
2. **SVG** - 矢量图形
3. **Mermaid** - 流程图和图表

## 📋 使用方法

1. 选择你要使用的格式
2. 在编辑器中输入代码
3. 实时查看右侧预览效果
4. 点击分享按钮生成链接

## 🔗 快速链接

- [GitHub](https://github.com)
- [文档](https://docs.example.com)
- [社区](https://community.example.com)

---

**提示**: 你可以随时切换格式来测试不同类型的代码！

\`\`\`javascript
// 示例代码块
function greet(name) {
    return \`Hello, \${name}! Welcome to HTML-Go!\`;
}

console.log(greet('Developer'));
\`\`\`

> 这是一个引用块，用来展示重要信息。

| 功能 | 支持 | 备注 |
|------|------|------|
| HTML 渲染 | ✅ | 完整支持 |
| Markdown 解析 | ✅ | 标准语法 |
| SVG 显示 | ✅ | 矢量图形 |
| Mermaid 图表 | ✅ | 流程图等 |`,
        svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="400" height="300" fill="#f8fafc"/>
  
  <!-- 主要图形 -->
  <circle cx="200" cy="150" r="80" fill="url(#gradient1)" filter="url(#shadow)"/>
  
  <!-- 文字 -->
  <text x="200" y="160" text-anchor="middle" fill="white" font-family="Inter, sans-serif" font-size="18" font-weight="600">HTML-Go</text>
  
  <!-- 装饰元素 -->
  <circle cx="120" cy="80" r="20" fill="#10b981" opacity="0.8">
    <animate attributeName="cy" values="80;70;80" dur="3s" repeatCount="indefinite"/>
  </circle>
  
  <circle cx="280" cy="220" r="15" fill="#f59e0b" opacity="0.8">
    <animate attributeName="cx" values="280;290;280" dur="4s" repeatCount="indefinite"/>
  </circle>
  
  <rect x="50" y="50" width="40" height="40" fill="#ef4444" opacity="0.6" rx="8">
    <animateTransform attributeName="transform" type="rotate" values="0 70 70;360 70 70" dur="8s" repeatCount="indefinite"/>
  </rect>
  
  <!-- 路径动画 -->
  <path d="M 50 250 Q 200 200 350 250" stroke="#6366f1" stroke-width="3" fill="none" opacity="0.7">
    <animate attributeName="d" values="M 50 250 Q 200 200 350 250;M 50 250 Q 200 180 350 250;M 50 250 Q 200 200 350 250" dur="5s" repeatCount="indefinite"/>
  </path>
</svg>`,
        mermaid: `graph TD
    A[HTML-Go 平台] --> B{选择格式}
    B -->|HTML| C[HTML 编辑器]
    B -->|Markdown| D[Markdown 编辑器]
    B -->|SVG| E[SVG 编辑器]
    B -->|Mermaid| F[Mermaid 编辑器]
    
    C --> G[实时渲染]
    D --> G
    E --> G
    F --> G
    
    G --> H[预览面板]
    H --> I{用户操作}
    I -->|满意| J[生成分享链接]
    I -->|修改| K[继续编辑]
    K --> G
    
    J --> L[分享给他人]
    L --> M[他人查看]
    
    style A fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff
    style G fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style J fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style M fill:#ef4444,stroke:#dc2626,stroke-width:2px,color:#fff`
      };
      
      setCode(examples[newFormat]);
    }
  };

  const handleSave = () => {
    if (isEditMode) {
      // 编辑模式：直接保存更新
      saveExistingDraft();
    } else {
      // 创建模式：打开分享对话框
      setIsShareDialogOpen(true);
    }
  };

  const handleShareLink = () => {
    setIsShareLinkDialogOpen(true);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 顶部工具栏 */}
      <TopToolbar 
        onShare={handleSave}
        onShareLink={handleShareLink}
        showShareLink={isEditMode}
      />
      
      {/* 主要内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧编辑器 */}
        <div className="w-1/2 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
          {/* 格式选择器 */}
          <div className="border-b border-gray-200 p-4 flex-shrink-0">
            <FormatSelector 
              currentFormat={format}
              onFormatChange={handleFormatChange}
              disabled={isEditMode}
            />
          </div>
          
          {/* 代码编辑器 */}
          <div className="flex-1 overflow-hidden">
            <CodeEditor 
              code={code}
              format={format}
              onChange={setCode}
            />
          </div>
        </div>
        
        {/* 右侧预览面板 */}
        <div className="w-1/2 bg-white overflow-hidden">
          <PreviewPanel 
            code={code}
            format={format}
          />
        </div>
      </div>
      
      {/* 分享对话框 - 只有在非编辑模式下才显示 */}
      {!isEditMode && (
        <ShareDialog 
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          code={code}
          format={format}
          existingPageId={pageId}
        />
      )}

      {/* 分享链接弹框 */}
      {pageId && (
        <ShareLinkDialog
          isOpen={isShareLinkDialogOpen}
          onClose={() => setIsShareLinkDialogOpen(false)}
          pageId={pageId}
          title={pageTitle || `${format.toUpperCase()} 作品`}
          codeType={format}
        />
      )}
    </div>
  );
};

export default Editor;
