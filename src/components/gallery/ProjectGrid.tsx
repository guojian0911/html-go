import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';

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

interface ProjectGridProps {
  works: Work[];
  searchQuery: string;
  onWorkClick: (workId: string) => void;
}

const ProjectGrid = ({ works, searchQuery, onWorkClick }: ProjectGridProps) => {
  const navigate = useNavigate();

  if (works.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-3">没有找到相关项目</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          {searchQuery ? '尝试调整搜索关键词或筛选条件' : '还没有发布的项目'}
        </p>
        <Button 
          onClick={() => navigate('/editor')}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
        >
          <Plus className="w-4 h-4 mr-2" />
          创建第一个项目
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {works.map((work) => (
        <ProjectCard
          key={work.id}
          work={work}
          onClick={onWorkClick}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;
