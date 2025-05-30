
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Search, Filter, Eye, Calendar, Code2, User, Share } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');

  // 模拟数据 - 实际项目中这里会从数据库获取
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
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZ3JhZDIiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMyZDEyNDI7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzFmMGEyMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSJ1cmwoI2dyYWQyKSIvPgogIDxjaXJjbGUgY3g9IjgwIiBjeT0iNjAiIHI9IjE1IiBmaWxsPSIjZmY2MzQ3IiBmaWxsLW9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjE2MCIgY3k9IjkwIiByPSIyMCIgZmlsbD0iIzM0ZDM5OSIgZmlsbC1vcGFjaXR5PSIwLjkiLz4KICA8Y2lyY2xlIGN4PSIyNDAiIGN5PSIxMjAiIHI9IjE4IiBmaWxsPSIjZmJkMzhjIiBmaWxsLW9wYWNpdHk9IjAuOSIvPgogIDxjaXJjbGUgY3g9IjEyMCIgY3k9IjE0MCIgcj0iMTIiIGZpbGw9IiNhNzg0ZmYiIGZpbGwtb3BhY2l0eT0iMC45Ii8+CiAgPGNpcmNsZSBjeD0iMjgwIiBjeT0iNDAiIHI9IjE0IiBmaWxsPSIjZjQ3MWI1IiBmaWxsLW9wYWNpdHk9IjAuOSIvPgo8L3N2Zz4K'
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

  const formats = [
    { value: 'all', label: '全部', color: 'default' },
    { value: 'html', label: 'HTML', color: 'destructive' },
    { value: 'markdown', label: 'Markdown', color: 'secondary' },
    { value: 'svg', label: 'SVG', color: 'outline' },
    { value: 'mermaid', label: 'Mermaid', color: 'default' },
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
      {/* 精简的顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">HTML-Go</h1>
                <p className="text-xs text-gray-500">多格式渲染分享平台</p>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center space-x-4">
              {/* 快速创建按钮 - 只显示加号 */}
              <Button 
                onClick={() => navigate('/editor')}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 p-0 flex items-center justify-center"
                size="icon"
              >
                <Plus className="w-5 h-5" />
              </Button>

              {/* 用户头像/登录按钮 */}
              <div className="flex items-center">
                <Avatar className="w-8 h-8 cursor-pointer">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gray-200">
                    <User className="w-4 h-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Projects 标题部分 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Projects</h2>
        </div>

        {/* 筛选标签栏 */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-3">
            {formats.map((format) => (
              <Badge
                key={format.value}
                variant={selectedFormat === format.value ? 'default' : 'outline'}
                className={`cursor-pointer px-6 py-2 text-sm font-medium transition-all hover:shadow-md ${
                  selectedFormat === format.value 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                }`}
                onClick={() => setSelectedFormat(format.value)}
              >
                {format.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="mb-12">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-base border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredWorks.map((work) => (
            <Card 
              key={work.id} 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 group border-0 shadow-lg rounded-2xl overflow-hidden bg-white"
              onClick={() => handleWorkClick(work.id)}
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
          ))}
        </div>

        {/* 空状态 */}
        {filteredWorks.length === 0 && (
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
        )}
      </main>
    </div>
  );
};

export default Gallery;
