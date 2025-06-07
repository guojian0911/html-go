
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
          <p className="text-sm text-blue-800 font-medium">草稿说明</p>
          <p className="text-xs text-blue-600 mt-1">
            代码已保存到你的个人草稿箱。你可以在个人资料页面中管理草稿，编辑内容或发布为公开作品。
            {usePassword ? '设置了密码保护，发布后需要密码才能查看。' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareInfo;
