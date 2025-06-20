
import React from 'react';
import CodeEditor from '../CodeEditor';
import FormatSelector from '../FormatSelector';
import type { CodeFormat } from '@/hooks/useEditorState';

interface EditorSidebarProps {
  code: string;
  format: CodeFormat;
  onCodeChange: (code: string) => void;
  onFormatChange: (format: CodeFormat) => void;
  isEditMode: boolean;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  code,
  format,
  onCodeChange,
  onFormatChange,
  isEditMode
}) => {
  return (
    <div className="w-1/2 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
      {/* Format Selector */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0">
        <FormatSelector 
          currentFormat={format}
          onFormatChange={onFormatChange}
          disabled={isEditMode}
        />
      </div>
      
      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor 
          code={code}
          format={format}
          onChange={onCodeChange}
        />
      </div>
    </div>
  );
};

export default EditorSidebar;
