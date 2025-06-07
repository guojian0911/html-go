
import React from 'react';
import { FolderOpen, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CodeFormat } from '../../pages/Index';

interface ShareActionsProps {
  shareUrl: string;
  shareId: string;
  code: string;
  format: CodeFormat;
}

const ShareActions: React.FC<ShareActionsProps> = ({
  shareUrl,
  shareId,
  code,
  format
}) => {
  const navigate = useNavigate();

  const goToDrafts = () => {
    navigate('/profile?tab=draft');
  };

  const continueEditing = () => {
    navigate('/editor');
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        onClick={goToDrafts}
        variant="outline"
        className="btn-secondary"
        disabled={!shareUrl}
      >
        <FolderOpen className="w-4 h-4 mr-2" />
        查看草稿箱
      </Button>

      <Button
        onClick={continueEditing}
        variant="outline"
        className="btn-secondary"
      >
        <Edit className="w-4 h-4 mr-2" />
        继续编辑
      </Button>
    </div>
  );
};

export default ShareActions;
