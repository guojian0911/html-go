
import React from 'react';
import { Input } from '@/components/ui/input';

interface PasswordSectionProps {
  usePassword: boolean;
  password: string;
  isGenerating: boolean;
  shareUrl: string;
  onUsePasswordChange: (checked: boolean) => void;
  onPasswordChange: (password: string) => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  usePassword,
  password,
  isGenerating,
  shareUrl,
  onUsePasswordChange,
  onPasswordChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="usePassword"
          checked={usePassword}
          onChange={(e) => onUsePasswordChange(e.target.checked)}
          className="rounded border-gray-300"
          disabled={isGenerating || Boolean(shareUrl)}
        />
        <label htmlFor="usePassword" className="text-sm font-medium text-gray-700">
          发布时使用密码保护
        </label>
      </div>
      
      {usePassword && (
        <Input
          type="password"
          placeholder="设置发布后的访问密码"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isGenerating || Boolean(shareUrl)}
          className="text-sm"
        />
      )}
    </div>
  );
};

export default PasswordSection;
