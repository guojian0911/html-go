import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TIMING, PROGRESS } from '@/constants/ui';
import { clamp, generateSkeletonArray } from '@/utils/ui-helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-blue-600',
        sizeClasses[size],
        className
      )} 
    />
  );
};

interface LoadingOverlayProps {
  children?: React.ReactNode;
  loading: boolean;
  className?: string;
  text?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  children, 
  loading, 
  className,
  text = '加载中...'
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <span className="text-sm text-gray-600 font-medium">{text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

interface LoadingDotsProps {
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ className }) => {
  return (
    <div className={cn('flex space-x-1', className)}>
      {generateSkeletonArray(3, 0).map((index) => (
        <div
          key={index}
          className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${index * TIMING.DOT_ANIMATION_DELAY}s`,
            animationDuration: `${TIMING.DOT_ANIMATION_DURATION}s`,
          }}
        />
      ))}
    </div>
  );
};

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  className,
  showPercentage = true 
}) => {
  const clampedProgress = clamp(progress, PROGRESS.MIN, PROGRESS.MAX);
  
  return (
    <div className={cn('w-full', className)}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">加载进度</span>
        {showPercentage && (
          <span className="text-sm text-gray-500">{Math.round(clampedProgress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

interface PulseLoaderProps {
  className?: string;
  count?: number;
}

export const PulseLoader: React.FC<PulseLoaderProps> = ({ 
  className,
  count = 3 
}) => {
  return (
    <div className={cn('flex space-x-2', className)}>
      {generateSkeletonArray(count, 0).map((index) => (
        <div
          key={index}
          className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"
          style={{
            animationDelay: `${index * TIMING.PULSE_ANIMATION_DELAY}s`,
            animationDuration: `${TIMING.PULSE_ANIMATION_DURATION}s`,
          }}
        />
      ))}
    </div>
  );
}; 