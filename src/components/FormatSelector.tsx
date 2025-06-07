
import React from 'react';
import { CodeFormat } from '../pages/Index';
import { Code, FileText, Image, GitBranch } from 'lucide-react';

interface FormatSelectorProps {
  currentFormat: CodeFormat;
  onFormatChange: (format: CodeFormat) => void;
  disabled?: boolean;
}

const FormatSelector: React.FC<FormatSelectorProps> = ({ 
  currentFormat, 
  onFormatChange,
  disabled = false
}) => {
  const formats = [
    {
      id: 'html' as CodeFormat,
      name: 'HTML',
      icon: Code,
      description: '网页标记语言',
      color: 'text-orange-500'
    },
    {
      id: 'markdown' as CodeFormat,
      name: 'Markdown',
      icon: FileText,
      description: '轻量级标记语言',
      color: 'text-blue-500'
    },
    {
      id: 'svg' as CodeFormat,
      name: 'SVG',
      icon: Image,
      description: '矢量图形',
      color: 'text-green-500'
    },
    {
      id: 'mermaid' as CodeFormat,
      name: 'Mermaid',
      icon: GitBranch,
      description: '流程图和图表',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        选择格式
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {formats.map((format) => {
          const IconComponent = format.icon;
          const isActive = currentFormat === format.id;
          
          return (
            <button
              key={format.id}
              onClick={() => !disabled && onFormatChange(format.id)}
              disabled={disabled && !isActive}
              className={`
                p-3 rounded-lg border-2 transition-all duration-200 text-left
                ${disabled && !isActive 
                  ? 'border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed'
                  : isActive 
                    ? 'border-brand-primary bg-brand-primary/5 shadow-brand-md' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  ${isActive ? 'bg-brand-primary text-white' : 'bg-gray-100'}
                `}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className={`
                      font-semibold text-sm
                      ${isActive ? 'text-brand-primary' : 'text-gray-900'}
                    `}>
                      {format.name}
                    </h4>
                    {isActive && (
                      <div className="w-2 h-2 bg-brand-primary rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {format.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* 快捷提示 */}
      <div className={`mt-4 p-3 rounded-lg border ${disabled ? 'bg-orange-50 border-orange-200' : 'bg-blue-50 border-blue-200'}`}>
        <div className="flex items-start space-x-2">
          <div className={`w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${disabled ? 'bg-orange-500' : 'bg-blue-500'}`}>
            <span className="text-white text-xs font-bold">{disabled ? '🔒' : '!'}</span>
          </div>
          <div>
            <p className={`text-sm font-medium ${disabled ? 'text-orange-800' : 'text-blue-800'}`}>
              {disabled ? '编辑模式' : '快捷提示'}
            </p>
            <p className={`text-xs mt-1 ${disabled ? 'text-orange-600' : 'text-blue-600'}`}>
              {disabled 
                ? '正在编辑现有作品，格式已锁定，无法切换到其他格式'
                : '切换格式时会自动加载示例代码，帮你快速上手！'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;
