
import React, { useEffect } from 'react';
import { useEditorState } from '@/hooks/useEditorState';
import { useEditorActions } from '@/hooks/useEditorActions';
import EditorLayout from '@/components/editor/EditorLayout';

const Editor = () => {
  const {
    code,
    setCode,
    format,
    setFormat,
    isShareDialogOpen,
    setIsShareDialogOpen,
    isShareLinkDialogOpen,
    setIsShareLinkDialogOpen,
    isLoading,
    setIsLoading,
    pageTitle,
    setPageTitle,
    pageId,
    isEditMode,
    user,
    getDefaultExampleCode
  } = useEditorState();

  const {
    loadDraftData,
    saveExistingDraft,
    handleFormatChange
  } = useEditorActions({
    user,
    pageId,
    isEditMode,
    setIsLoading,
    setCode,
    setFormat,
    setPageTitle,
    getDefaultExampleCode
  });

  // Load draft data or set default example on mount
  useEffect(() => {
    if (pageId && user) {
      loadDraftData(pageId);
    } else if (!pageId) {
      // If no ID parameter, set default example code
      setCode(getDefaultExampleCode(format));
    }
  }, [pageId, user]);

  const handleSave = () => {
    if (isEditMode) {
      // Edit mode: directly save updates
      saveExistingDraft(code);
    } else {
      // Create mode: open share dialog
      setIsShareDialogOpen(true);
    }
  };

  const handleShareLink = () => {
    setIsShareLinkDialogOpen(true);
  };

  return (
    <EditorLayout
      // Toolbar props
      onSave={handleSave}
      onShareLink={handleShareLink}
      showShareLink={isEditMode}
      
      // Sidebar props
      code={code}
      format={format}
      onCodeChange={setCode}
      onFormatChange={handleFormatChange}
      isEditMode={isEditMode}
      
      // Dialog props
      isShareDialogOpen={isShareDialogOpen}
      onShareDialogClose={() => setIsShareDialogOpen(false)}
      pageId={pageId}
      isShareLinkDialogOpen={isShareLinkDialogOpen}
      onShareLinkDialogClose={() => setIsShareLinkDialogOpen(false)}
      pageTitle={pageTitle}
    />
  );
};

export default Editor;
