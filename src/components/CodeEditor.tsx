import React, { useEffect, useRef } from 'react';
import { CodeFormat } from '../pages/Index';

interface CodeEditorProps {
  code: string;
  format: CodeFormat;
  onChange: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, format, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // 自动调整文本框高度
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  const getPlaceholder = () => {
    const placeholders = {
      html: '在这里输入或粘贴你的 HTML 代码...\n\n例如：\n<h1>Hello World!</h1>\n<p>这是一个 HTML 示例</p>',
      markdown: '在这里输入或粘贴你的 Markdown 内容...\n\n例如：\n# 标题\n\n**粗体文字** 和 *斜体文字*\n\n- 列表项 1\n- 列表项 2',
      svg: '在这里输入或粘贴你的 SVG 代码...\n\n例如：\n<svg viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="blue" />\n</svg>',
      mermaid: '在这里输入或粘贴你的 Mermaid 图表代码...\n\n例如：\ngraph TD\n    A[开始] --> B[处理]\n    B --> C[结束]'
    };
    return placeholders[format];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Tab 键处理
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      onChange(newValue);
      
      // 设置光标位置
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 编辑器头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600 font-mono">
            {format}.editor
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>行: {code.split('\n').length}</span>
          <span>•</span>
          <span>字符: {code.length}</span>
        </div>
      </div>
      
      {/* 代码编辑区域 */}
      <div className="flex-1 relative overflow-hidden">
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          className={`
            w-full h-full p-4 pl-12 font-mono text-sm leading-relaxed
            bg-gray-900 text-gray-100 placeholder-gray-500
            border-none outline-none resize-none overflow-auto
            focus:ring-0
          `}
          spellCheck={false}
        />
        
        {/* 行号指示器 */}
        <div className="absolute top-4 left-0 text-xs text-gray-600 font-mono select-none pointer-events-none overflow-hidden">
          {code.split('\n').map((_, index) => (
            <div key={index} className="h-6 px-2 text-right w-8">
              {index + 1}
            </div>
          ))}
        </div>
      </div>
      
      {/* 编辑器底部状态栏 */}
      <div className="p-2 bg-gray-800 text-xs text-gray-400 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-4">
          <span className="capitalize">{format}</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="status-indicator status-success"></div>
          <span>实时同步</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
