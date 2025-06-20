
import React from 'react';
import PreviewPanel from '../PreviewPanel';
import type { CodeFormat } from '@/hooks/useEditorState';

interface EditorPreviewProps {
  code: string;
  format: CodeFormat;
}

const EditorPreview: React.FC<EditorPreviewProps> = ({ code, format }) => {
  return (
    <div className="w-1/2 bg-white overflow-hidden">
      <PreviewPanel 
        code={code}
        format={format}
      />
    </div>
  );
};

export default EditorPreview;
