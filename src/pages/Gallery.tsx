import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryHeader from '@/components/gallery/GalleryHeader';
import HeroSection from '@/components/gallery/HeroSection';
import ProjectsSection from '@/components/gallery/ProjectsSection';
import FilterTabs from '@/components/gallery/FilterTabs';
import ProjectGrid from '@/components/gallery/ProjectGrid';

const Gallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // Mock data with enhanced accessibility considerations
  const mockWorks = [
    {
      id: '1',
      title: '图书管理系统',
      description: '基于React的现代化图书管理系统，支持借阅管理和用户权限控制',
      format: 'html',
      viewCount: 234,
      shareCount: 15,
      createdAt: '2024-01-15',
      author: '张三',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWU0MDQ4O3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyZDU3NjU7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmFkMSkiLz4KICA8Y2lyY2xlIGN4PSI2MCIgY3k9IjkwIiByPSIyMCIgZmlsbD0iIzMzNzNkYyIgZmlsbC1vcGFjaXR5PSIwLjgiLz4KICA8cmVjdCB4PSIxMjAiIHk9IjcwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8dGV4dCB4PSIxODAiIHk9Ijk1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjMWU0MDQ4IiBmb250LXNpemU9IjE0cHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7lm77kuabkuK3lv4M8L3RleHQ+Cjwvc3ZnPgo='
    },
    {
      id: '2',
      title: '泡泡消除游戏',
      description: 'HTML5 Canvas实现的休闲益智游戏，支持多种游戏模式',
      format: 'html',
      viewCount: 156,
      shareCount: 8,
      createdAt: '2024-01-14',
      author: '李四',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZDIiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyZDEyNDI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFmMGEyMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2dyYWQyKSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iNjAiIHI9IjE1IiBmaWxsPSIjZmY2MzQ3IiBmaWxsLW9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIyMCIgZmlsbD0iIzM0ZDM5OSIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIyNDAiIGN5PSIxMjAiIHI9IjE4IiBmaWxsPSIjZjQ3MWI1IiBmaWxsLW9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjEyMCIgY3k9IjE0MCIgcj0iMTIiIGZpbGw9IiNhNzg0ZmYiIGZpbGwtb3BhY2l0eT0iMC45Ii8+CiAgPGNpcmNsZSBjeD0iMjgwIiBjeT0iNDAiIHI9IjE0IiBmaWxsPSIjZjlmYWZiIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8L3N2Zz4K'
    },
    {
      id: '3',
      title: '雕塑艺术家作品集',
      description: '现代简约风格的艺术家个人作品展示网站',
      format: 'html',
      viewCount: 89,
      shareCount: 3,
      createdAt: '2024-01-13',
      author: '王五',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDMiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzExMTgyNztzdG9wLW9wYWNpdHk6MSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMzc0MTUxO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjMyMCIgaGVpZ2h0PSIxODAiIGZpbGw9InVybCgjZ3JhZDMpIi8+CiAgPGNpcmNsZSBjeD0iMTYwIiBjeT0iNzAiIHI9IjMwIiBmaWxsPSIjNjZkOWVmIiBmaWxsLW9wYWNpdHk9IjAuNyIvPgogIDx0ZXh0IHg9IjE2MCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZjlmYWZiIiBmb250LXNpemU9IjE4cHgiIGZvbnQtZmFtaWx5PSJzZXJpZiI+6ZuV5aGR6Im65pyv5a626L2s6ZuGPC90ZXh0Pgo8L3N2Zz4K'
    },
    {
      id: '4',
      title: '财富时间计算器',
      description: '个人理财工具，计算投资回报和财务规划',
      format: 'html',
      viewCount: 312,
      shareCount: 22,
      createdAt: '2024-01-12',
      author: '赵六',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzMzNGNhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM0c3JhNWM7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0idXJsKCNncmFkNCkiLz4KICA8cmVjdCB4PSIyMDAiIHk9IjIwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI2ZiZDM4YyIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8dGV4dCB4PSIyNTAiIHk9IjQ1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTIzMDBmIiBmb250LXNpemU9IjEycHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7otKLlr4bmmYLpl7Q8L3RleHQ+CiAgPHRleHQgeD0iMjUwIiB5PSI2NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzkyMzAwZiIgZm9udC1zaXplPSIxMnB4IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiI+6K2h566X5ZmoPC90ZXh0PgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iMTMwIiByPSIyNSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KICA8dGV4dCB4PSI4MCIgeT0iMTM2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIiBmb250LXNpemU9IjE0cHgiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj7moKE8L3RleHQ+Cjwvc3ZnPgo='
    },
  ];

  const filteredWorks = mockWorks.filter(work => {
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || work.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const handleWorkClick = (workId: string) => {
    navigate(`/work/${workId}`);
  };

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
