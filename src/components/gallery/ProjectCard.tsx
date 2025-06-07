import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Share, ImageIcon } from 'lucide-react';

interface Work {
  id: string;
  title: string;
  description: string;
  format: string;
  viewCount: number;
  shareCount: number;
  createdAt: string;
  author: string;
  thumbnail: string;
}

interface ProjectCardProps {
  work: Work;
  onClick: (workId: string) => void;
}

const ProjectCard = ({ work, onClick }: ProjectCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleCardClick = () => {
    // 添加轻微的点击反馈
    onClick(work.id);
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 group border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 h-full flex flex-col"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`查看项目：${work.title}`}
    >
      <CardHeader className="p-0">
        <div className="aspect-video bg-gray-100 overflow-hidden relative">
          {/* 图片加载状态 */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="w-20 h-3 rounded" />
              </div>
            </div>
          )}
          
          {/* 图片加载错误状态 */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center space-y-2 text-gray-400">
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs">预览图加载失败</span>
              </div>
            </div>
          )}
          
          {/* 实际图片 */}
          <img 
            src={work.thumbnail} 
            alt={`${work.title} 预览图`}
            className={`w-full h-full object-cover transition-all duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ display: imageError ? 'none' : 'block' }}
          />
          
          {/* Enhanced overlay with better accessibility */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className={`transition-all duration-300 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Eye className="w-5 h-5 text-gray-700" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex items-start mb-3">
          <Avatar className="w-8 h-8 mr-3 mt-1 ring-2 ring-transparent group-hover:ring-blue-200 transition-all duration-200">
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-medium group-hover:bg-blue-200 transition-colors duration-200">
              {work.author?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight mb-1">
              {work.title}
            </CardTitle>
            <p className="text-sm text-gray-600 font-medium transition-colors duration-200 group-hover:text-gray-700">
              {work.author}
            </p>
          </div>
        </div>

        <CardDescription className="text-gray-700 mb-4 line-clamp-2 text-sm leading-relaxed flex-1 group-hover:text-gray-800 transition-colors duration-200">
          {work.description || '暂无描述'}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div 
            className="flex items-center space-x-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-1 cursor-default group-hover:text-gray-700 transition-colors duration-200" aria-label={`${work.viewCount} 次浏览`}>
              <Eye className="w-4 h-4 text-gray-500 group-hover:text-gray-600 transition-colors duration-200" aria-hidden="true" />
              <span className="font-medium">{work.viewCount}</span>
            </div>
            <div className="flex items-center space-x-1 cursor-default group-hover:text-gray-700 transition-colors duration-200" aria-label={`${work.shareCount} 次分享`}>
              <Share className="w-4 h-4 text-gray-500 group-hover:text-gray-600 transition-colors duration-200" aria-hidden="true" />
              <span className="font-medium">{work.shareCount}</span>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-xs font-medium border-gray-300 text-gray-700 bg-gray-50 group-hover:bg-gray-100 group-hover:border-gray-400 transition-all duration-200"
          >
            {work.format.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
