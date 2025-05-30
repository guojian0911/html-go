
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FilterTabsProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

const FilterTabs = ({ selectedFormat, onFormatChange }: FilterTabsProps) => {
  const formats = [
    { value: 'all', label: '全部', color: 'default' },
    { value: 'html', label: 'HTML', color: 'destructive' },
    { value: 'markdown', label: 'Markdown', color: 'secondary' },
    { value: 'svg', label: 'SVG', color: 'outline' },
    { value: 'mermaid', label: 'Mermaid', color: 'default' },
  ];

  return (
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
            onClick={() => onFormatChange(format.value)}
          >
            {format.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default FilterTabs;
