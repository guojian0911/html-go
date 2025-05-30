
import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShareUrlSectionProps {
  shareUrl: string;
  isGenerating: boolean;
  copied: boolean;
  onCopyToClipboard: () => void;
}

const ShareUrlSection: React.FC<ShareUrlSectionProps> = ({
  shareUrl,
  isGenerating,
  copied,
  onCopyToClipboard
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">
        分享链接
      </label>
      
      {isGenerating ? (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">正在生成分享链接...</p>
          </div>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Input
            value={shareUrl}
            readOnly
            className="font-mono text-sm"
            placeholder="生成中..."
          />
          <Button
            onClick={onCopyToClipboard}
            variant="outline"
            size="sm"
            className="flex-shrink-0"
            disabled={!shareUrl}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShareUrlSection;
