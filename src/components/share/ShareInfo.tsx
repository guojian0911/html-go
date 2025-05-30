
import React from 'react';

interface ShareInfoProps {
  usePassword: boolean;
}

const ShareInfo: React.FC<ShareInfoProps> = ({ usePassword }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
      <div className="flex items-start space-x-2">
        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
          <span className="text-white text-xs font-bold">i</span>
        </div>
        <div>
          <p className="text-sm text-blue-800 font-medium">分享说明</p>
          <p className="text-xs text-blue-600 mt-1">
            分享链接包含完整的代码和预览效果，{usePassword ? '需要密码才能' : '任何人都可以通过链接'}查看。
            代码将永久保存在服务器上。
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareInfo;
