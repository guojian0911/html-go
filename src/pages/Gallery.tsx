
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryService } from '@/services/GalleryService';
import { Skeleton } from '@/components/ui/skeleton';
import AppHeader from '@/components/common/AppHeader';
import HeroSection from '@/components/gallery/HeroSection';
import ProjectsSection from '@/components/gallery/ProjectsSection';
import FilterTabs from '@/components/gallery/FilterTabs';
import ProjectGrid from '@/components/gallery/ProjectGrid';

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

// 项目卡片骨架屏组件
const ProjectCardSkeleton = () => (
  <div className="border border-gray-200 shadow-sm rounded-2xl overflow-hidden bg-white h-full flex flex-col">
    <div className="aspect-video bg-gray-100 p-4">
      <Skeleton className="w-full h-full rounded-lg" />
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex items-start mb-3">
        <Skeleton className="w-8 h-8 rounded-full mr-3 mt-1" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  </div>
);

const Gallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublishedPages();
  }, []);

  const fetchPublishedPages = async () => {
    try {
      setError(null);
      
      // 使用优化后的 GalleryService 进行批量查询
      const result = await GalleryService.getPublishedWorks({
        limit: 50, // 增加初始加载数量
        offset: 0
      });

      if (!result.success) {
        throw new Error(result.error || '获取作品列表失败');
      }

      setWorks(result.data.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      setError('加载项目失败，请稍后重试');
    } finally {
      // 添加最小加载时间以避免闪烁
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  const filteredWorks = works.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || work.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const handleWorkClick = (workId: string) => {
    window.open(`/share/${workId}?preview=true`, '_blank');
  };

  const handleRetry = () => {
    setIsLoading(true);
    fetchPublishedPages();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader showNavigation={true} currentPage="gallery" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Hero section skeleton */}
          <div className="py-16 text-center">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-80 mx-auto mb-8" />
            <Skeleton className="h-12 w-80 mx-auto" />
          </div>
          
          {/* Projects section skeleton */}
          <div className="mb-12">
            <Skeleton className="h-8 w-32 mb-8" />
          </div>
          
          {/* Filter tabs skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-20" />
            ))}
          </div>
          
          {/* Project grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader showNavigation={true} currentPage="gallery" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader showNavigation={true} currentPage="gallery" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <HeroSection 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <ProjectsSection />
        
        <FilterTabs 
          selectedFormat={selectedFormat}
          onFormatChange={setSelectedFormat}
        />
        
        <ProjectGrid 
          works={filteredWorks}
          searchQuery={searchQuery}
          onWorkClick={handleWorkClick}
        />
      </main>
    </div>
  );
};

export default Gallery;
