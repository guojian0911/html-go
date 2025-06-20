import { toast } from '@/hooks/use-toast';
import { PagesService } from '@/services/PagesService';
import type { CodeFormat } from './useEditorState';

interface UseEditorActionsProps {
  user: any;
  pageId: string | null;
  isEditMode: boolean;
  setIsLoading: (loading: boolean) => void;
  setCode: (code: string) => void;
  setFormat: (format: CodeFormat) => void;
  setPageTitle: (title: string) => void;
  getDefaultExampleCode: (format: CodeFormat) => string;
}

export const useEditorActions = ({
  user,
  pageId,
  isEditMode,
  setIsLoading,
  setCode,
  setFormat,
  setPageTitle,
  getDefaultExampleCode
}: UseEditorActionsProps) => {
  
  // Load draft data
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

  // Save existing draft updates
  const saveExistingDraft = async (code: string) => {
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

  // Handle format change
  const handleFormatChange = (newFormat: CodeFormat) => {
    setFormat(newFormat);
    
    // Only show example code when creating new content (no pageId)
    // If editing existing draft, keep current code unchanged
    if (!pageId) {
      setCode(getDefaultExampleCode(newFormat));
    }
  };

  return {
    loadDraftData,
    saveExistingDraft,
    handleFormatChange
  };
};
