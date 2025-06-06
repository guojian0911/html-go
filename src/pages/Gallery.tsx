
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import GalleryHeader from '@/components/gallery/GalleryHeader';
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

const Gallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublishedPages();
  }, []);

  const fetchPublishedPages = async () => {
    try {
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
        author: (page.render_profiles as any)?.display_name || '匿名用户',
        thumbnail: generateThumbnail(page.code_type)
      }));

      setWorks(formattedWorks);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateThumbnail = (codeType: string) => {
    const thumbnails = {
      html: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWU0MDQ4O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyZDU3NjU7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmFkMSkiLz4KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjkwIiByPSIyMCIgZmlsbD0iIzMzNzNkYyIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KICA8cmVjdCB4PSIxMjAiIHk9IjcwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8dGV4dCB4PSIxODAiIHk9Ijk1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWU0MDQ4IiBmb250LXNpemU9IjE0cHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5IVE1MPC90ZXh0Pgo8L3N2Zz4K',
      markdown: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDIiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMjU0MTdlO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA<stop offset="100%" style="stop-color:#3730a3;stop-opacity:1" /></linearGradient></defs><rect width="320" height="180" fill="url(#grad2)"/><text x="160" y="100" text-anchor="middle" fill="#ffffff" font-size="18px" font-family="sans-serif">Markdown</text></svg>',
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
    navigate(`/work/${workId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <GalleryHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GalleryHeader />
      
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
