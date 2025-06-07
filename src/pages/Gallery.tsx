import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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
      const { data, error } = await supabase
        .from('render_pages')
        .select(`
          id,
          title,
          description,
          code_type,
          view_count,
          share_count,
          created_at,
          render_profiles!inner(display_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedWorks: Work[] = (data || []).map(page => ({
        id: page.id,
        title: page.title,
        description: page.description || '',
        format: page.code_type,
        viewCount: page.view_count,
        shareCount: page.share_count,
        createdAt: page.created_at,
        author: (page.render_profiles as unknown as { display_name: string })?.display_name || '匿名用户',
        thumbnail: generateThumbnail(page.code_type)
      }));

      setWorks(formattedWorks);
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

  const generateThumbnail = (codeType: string) => {
    const thumbnails = {
      html: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWU0MDQ4O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyZDU3NjU7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmFkMSkiLz4KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjkwIiByPSIyMCIgZmlsbD0iIzMzNzNkYyIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KICA8cmVjdCB4PSIxMjAiIHk9IjcwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8dGV4dCB4PSIxODAiIHk9Ijk1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWU0MDQ4IiBmb250LXNpemU9IjE0cHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5IVE1MPC90ZXh0Pgo8L3N2Zz4K',
      markdown: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjU0MTdlO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzNzMwYTM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmFkMikiLz4KICA8Y2lyY2xlIGN4PSI4MCIgY3k9IjYwIiByPSIxNSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KICA8cmVjdCB4PSI2MCIgeT0iMTEwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuNiIvPgogIDxyZWN0IHg9IjYwIiB5PSIxMzAiIHdpZHRoPSIxNjAiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC42Ii8+CiAgPHRleHQgeD0iMTYwIiB5PSI5NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1zaXplPSIxOHB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TWFya2Rvd248L3RleHQ+Cjwvc3ZnPgo=',
      svg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzExMTgyNztzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzc0MTUxO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9InVybCgjZ3JhZDMpIi8+CiAgPGNpcmNsZSBjeD0iMTYwIiBjeT0iNzAiIHI9IjMwIiBmaWxsPSIjNjZkOWVmIiBmaWxsLW9wYWNpdHk9IjAuNyIvPgogIDx0ZXh0IHg9IjE2MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZjlmYWZiIiBmb250LXNpemU9IjE4cHgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+U1ZHPC90ZXh0Pgo8L3N2Zz4K',
      mermaid: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzMzNGNhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0c3JhNWM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmFkNCkiLz4KICA8dGV4dCB4PSIxNjAiIHk9IjEwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI2ZmZmZmZiIgZm9udC1zaXplPSIxOHB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+TWVybWFpZDwvdGV4dD4KPC9zdmc+Cg=='
    };
    return thumbnails[codeType as keyof typeof thumbnails] || thumbnails.html;
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
