
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <div className="text-center py-16 mb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            发现、创建与分享
          </span>
        </h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          多格式渲染的中心平台
        </h2>
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          探索高质量的代码作品，提升您与开发者交流的效率，释放创意的全部潜能
        </p>
        
        {/* 大搜索框 */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <Input
              placeholder="搜索项目、类别或关键词..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-16 pr-6 py-6 text-lg border-gray-300 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
