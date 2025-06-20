
import React from 'react';
import TopToolbar from '../TopToolbar';
import EditorSidebar from './EditorSidebar';
import EditorPreview from './EditorPreview';
import EditorDialogs from './EditorDialogs';
import type { CodeFormat } from '@/hooks/useEditorState';

interface EditorLayoutProps {
  // Toolbar props
  onSave: () => void;
  onShareLink: () => void;
  showShareLink: boolean;
  
  // Sidebar props
  code: string;
  format: CodeFormat;
  onCodeChange: (code: string) => void;
  onFormatChange: (format: CodeFormat) => void;
  isEditMode: boolean;
  
  // Dialog props
  isShareDialogOpen: boolean;
  onShareDialogClose: () => void;
  pageId: string | null;
  isShareLinkDialogOpen: boolean;
  onShareLinkDialogClose: () => void;
  pageTitle: string;
}

const EditorLayout: React.FC<EditorLayoutProps> = ({
  onSave,
  onShareLink,
  showShareLink,
  code,
  format,
  onCodeChange,
  onFormatChange,
  isEditMode,
  isShareDialogOpen,
  onShareDialogClose,
  pageId,
  isShareLinkDialogOpen,
  onShareLinkDialogClose,
  pageTitle
}) => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <TopToolbar 
        onShare={onSave}
        onShareLink={onShareLink}
        showShareLink={showShareLink}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Editor */}
        <EditorSidebar
          code={code}
          format={format}
          onCodeChange={onCodeChange}
          onFormatChange={onFormatChange}
          isEditMode={isEditMode}
        />
        
        {/* Right Preview Panel */}
        <EditorPreview
          code={code}
          format={format}
        />
      </div>
      
      {/* Dialogs */}
      <EditorDialogs
        isShareDialogOpen={isShareDialogOpen}
        onShareDialogClose={onShareDialogClose}
        code={code}
        format={format}
        pageId={pageId}
        isEditMode={isEditMode}
        isShareLinkDialogOpen={isShareLinkDialogOpen}
        onShareLinkDialogClose={onShareLinkDialogClose}
        pageTitle={pageTitle}
      />
    </div>
  );
};

export default EditorLayout;
