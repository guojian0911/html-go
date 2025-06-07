import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SIZES, LAYOUT } from '@/constants/ui';
import { generateSkeletonArray } from '@/utils/ui-helpers';

// 基础骨架屏组件接口
interface SkeletonProps {
  className?: string;
}

/**
 * 用户头像骨架屏
 */
export const AvatarSkeleton: React.FC<SkeletonProps & { size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: `w-${SIZES.SMALL_AVATAR.width} h-${SIZES.SMALL_AVATAR.height}`,
    md: `w-${SIZES.MEDIUM_AVATAR.width} h-${SIZES.MEDIUM_AVATAR.height}`,
    lg: `w-${SIZES.LARGE_AVATAR.width} h-${SIZES.LARGE_AVATAR.height}`,
  };

  return (
    <Skeleton 
      className={`${sizeClasses[size]} rounded-full ${className}`} 
    />
  );
};

/**
 * 按钮骨架屏
 */
export const ButtonSkeleton: React.FC<SkeletonProps & { width?: string }> = ({ 
  className = '', 
  width = 'w-16' 
}) => (
  <Skeleton className={`h-10 ${width} rounded-md ${className}`} />
);

/**
 * 文本行骨架屏
 */
export const TextLineSkeleton: React.FC<SkeletonProps & { 
  lines?: number; 
  spacing?: string;
}> = ({ 
  className = '', 
  lines = 1, 
  spacing = 'space-y-2' 
}) => (
  <div className={`${spacing} ${className}`}>
    {generateSkeletonArray(lines).map((index) => (
      <Skeleton 
        key={index} 
        className={`h-4 ${index === lines ? 'w-3/4' : 'w-full'}`}
      />
    ))}
  </div>
);

/**
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white h-full flex flex-col ${className}`}>
    {/* 图片区域 */}
    <div className="aspect-video bg-gray-100 p-4">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
    
    {/* 内容区域 */}
    <div className="p-6 flex-1 flex flex-col">
      {/* 标题 */}
      <Skeleton className="h-6 w-3/4 mb-2" />
      
      {/* 描述 */}
      <div className="space-y-2 mb-4 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* 底部信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AvatarSkeleton size="sm" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * 项目网格骨架屏
 */
export const ProjectGridSkeleton: React.FC<{ count?: number; className?: string }> = ({ 
  count = 8, 
  className = '' 
}) => (
  <div className={`${LAYOUT.PROJECT_GRID} ${className}`}>
    {generateSkeletonArray(count).map((index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
);

/**
 * 用户资料页骨架屏
 */
export const UserProfileSkeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
    {/* 头部背景 */}
    <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
      <div className="absolute -bottom-8 left-8">
        <AvatarSkeleton size="lg" />
      </div>
    </div>
    
    {/* 内容区域 */}
    <div className="pt-12 p-8">
      <div className="space-y-4">
        {/* 用户名 */}
        <Skeleton className="h-8 w-48" />
        
        {/* 简介 */}
        <TextLineSkeleton lines={2} />
        
        {/* 统计信息 */}
        <div className="flex space-x-8 pt-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/**
 * 表格行骨架屏
 */
export const TableRowSkeleton: React.FC<{ columns?: number; className?: string }> = ({ 
  columns = 4, 
  className = '' 
}) => (
  <tr className={`border-b border-gray-200 ${className}`}>
    {generateSkeletonArray(columns).map((index) => (
      <td key={index} className="px-6 py-4">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

/**
 * 表格骨架屏
 */
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => (
  <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-50">
        <tr>
          {generateSkeletonArray(columns).map((index) => (
            <th key={index} className="px-6 py-3">
              <Skeleton className="h-5 w-full" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {generateSkeletonArray(rows).map((index) => (
          <TableRowSkeleton key={index} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * 搜索结果骨架屏
 */
export const SearchResultsSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="space-y-6">
    {generateSkeletonArray(count).map((index) => (
      <div key={index} className="flex space-x-4 p-4 border border-gray-200 rounded-lg">
        <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <TextLineSkeleton lines={2} />
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * 空状态指示器
 */
export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = '' 
}) => (
  <div className={`text-center py-12 ${className}`}>
    {icon && (
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
    )}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
    )}
    {action}
  </div>
); 