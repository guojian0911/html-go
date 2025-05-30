
import React from 'react';
import { Globe, Lock, Clock } from 'lucide-react';
import { CodeFormat } from '../../pages/Index';

interface CodeInfoCardProps {
  code: string;
  format: CodeFormat;
}

const CodeInfoCard: React.FC<CodeInfoCardProps> = ({ code, format }) => {
  return (
    <div className="card-modern p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-info rounded-lg flex items-center justify-center">
            <Globe className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">代码快照</h4>
            <p className="text-xs text-gray-500">{format.toUpperCase()} 格式</p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-mono text-gray-600">{code.length} 字符</p>
          <p className="text-xs text-gray-500">{code.split('\n').length} 行</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Lock className="w-3 h-3" />
          <span>安全加密</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>永久保存</span>
        </div>
      </div>
    </div>
  );
};

export default CodeInfoCard;
