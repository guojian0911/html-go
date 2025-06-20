
import React from 'react';
import ShareDialog from '../ShareDialog';
import ShareLinkDialog from '../ShareLinkDialog';
import type { CodeFormat } from '@/hooks/useEditorState';

interface EditorDialogsProps {
  // Share Dialog
  isShareDialogOpen: boolean;
  onShareDialogClose: () => void;
  code: string;
  format: CodeFormat;
  pageId: string | null;
  isEditMode: boolean;
  
  // Share Link Dialog
  isShareLinkDialogOpen: boolean;
  onShareLinkDialogClose: () => void;
  pageTitle: string;
}

const EditorDialogs: React.FC<EditorDialogsProps> = ({
  isShareDialogOpen,
  onShareDialogClose,
  code,
  format,
  pageId,
  isEditMode,
  isShareLinkDialogOpen,
  onShareLinkDialogClose,
  pageTitle
}) => {
  return (
    <>
      {/* Share Dialog - only show in non-edit mode */}
      {!isEditMode && (
        <ShareDialog 
          isOpen={isShareDialogOpen}
          onClose={onShareDialogClose}
          code={code}
          format={format}
          existingPageId={pageId}
        />
      )}

      {/* Share Link Dialog */}
      {pageId && (
        <ShareLinkDialog
          isOpen={isShareLinkDialogOpen}
          onClose={onShareLinkDialogClose}
          pageId={pageId}
          title={pageTitle || `${format.toUpperCase()} 作品`}
          codeType={format}
        />
      )}
    </>
  );
};

export default EditorDialogs;
