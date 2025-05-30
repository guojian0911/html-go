
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Eye, Share } from 'lucide-react';

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
  return (
    <Card 
      className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 shadow-lg rounded-2xl overflow-hidden bg-white"
      onClick={() => onClick(work.id)}
    >
      <CardHeader className="p-0">
        <div className="aspect-video bg-gray-100 overflow-hidden relative">
          <img 
            src={work.thumbnail} 
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* 悬浮时显示预览按钮 */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Eye className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-start mb-3">
          <Avatar className="w-8 h-8 mr-3 mt-1">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
              {work.author?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight mb-1">
              {work.title}
            </CardTitle>
            <p className="text-sm text-gray-500">{work.author}</p>
          </div>
        </div>
        
        <CardDescription className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {work.description}
        </CardDescription>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{work.viewCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share className="w-4 h-4" />
              <span>{work.shareCount}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {work.format.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
