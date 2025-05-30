
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Filter, Eye, Calendar, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Gallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('latest');

  // 模拟数据 - 实际项目中这里会从数据库获取
  const mockWorks = [
    {
      id: '1',
      title: '响应式导航栏设计',
      description: '一个现代化的响应式导航栏，支持移动端适配',
      format: 'html',
      viewCount: 234,
      createdAt: '2024-01-15',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzMzNjZmZiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0cHgiPkhUTUw8L3RleHQ+Cjwvc3ZnPg=='
    },
    {
      id: '2',
      title: 'API文档模板',
      description: '清晰易读的API文档Markdown模板',
      format: 'markdown',
      viewCount: 156,
      createdAt: '2024-01-14',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iIzEwYjk4MSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEycHgiPk1hcmtkb3duPC90ZXh0Pgo8L3N2Zz4='
    },
    {
      id: '3',
      title: '数据流程图',
      description: '系统架构数据流程图示例',
      format: 'mermaid',
      viewCount: 89,
      createdAt: '2024-01-13',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2Y1OWUwYiIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjEycHgiPk1lcm1haWQ8L3RleHQ+Cjwvc3ZnPg=='
    },
    {
      id: '4',
      title: 'Logo设计',
      description: '矢量图标设计展示',
      format: 'svg',
      viewCount: 312,
      createdAt: '2024-01-12',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2VmNDQ0NCIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBmb250LXNpemU9IjE0cHgiPlNWRzwvdGV4dD4KPC9zdmc+'
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
      {/* 顶部导航栏 */}
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

            {/* 搜索框 */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索作品标题或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>

            {/* 快速创建按钮 */}
            <Button 
              onClick={() => navigate('/editor')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              快速创建
            </Button>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计信息和筛选栏 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">作品展示</h2>
              <p className="text-gray-600 mt-1">
                共 {filteredWorks.length} 个作品
                {searchQuery && ` · 搜索 "${searchQuery}"`}
                {selectedFormat !== 'all' && ` · ${formats.find(f => f.value === selectedFormat)?.label}`}
              </p>
            </div>
          </div>

          {/* 筛选器 */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">格式筛选:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {formats.map((format) => (
                <Badge
                  key={format.value}
                  variant={selectedFormat === format.value ? 'default' : 'outline'}
                  className={`cursor-pointer hover:bg-gray-100 ${
                    selectedFormat === format.value ? 'bg-blue-600 text-white' : ''
                  }`}
                  onClick={() => setSelectedFormat(format.value)}
                >
                  {format.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorks.map((work) => (
            <Card 
              key={work.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
              onClick={() => handleWorkClick(work.id)}
            >
              <CardHeader className="p-0">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img 
                    src={work.thumbnail} 
                    alt={work.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {work.title}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {work.format.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="text-gray-600 mb-3 line-clamp-2">
                  {work.description}
                </CardDescription>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{work.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{work.createdAt}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 空状态 */}
        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到相关作品</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? '尝试调整搜索关键词或筛选条件' : '还没有发布的作品'}
            </p>
            <Button 
              onClick={() => navigate('/editor')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              创建第一个作品
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Gallery;
