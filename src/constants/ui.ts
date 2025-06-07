// Animation and Timing Constants
export const TIMING = {
  // Navigation and interactions
  NAVIGATION_DELAY: 150, // ms - 导航反馈延迟
  MIN_LOADING_TIME: 300, // ms - 最小加载时间，避免闪烁
  EXTENDED_LOADING_TIME: 500, // ms - 扩展加载时间，用于数据密集操作
  USER_SYNC_DELAY: 100, // ms - 用户同步延迟
  
  // Animation durations
  FAST_TRANSITION: 200, // ms - 快速过渡
  NORMAL_TRANSITION: 300, // ms - 标准过渡
  SLOW_TRANSITION: 500, // ms - 慢速过渡
  
  // Loading dots animation
  DOT_ANIMATION_DELAY: 0.1, // s - 点动画间隔
  DOT_ANIMATION_DURATION: 1, // s - 点动画持续时间
  PULSE_ANIMATION_DELAY: 0.15, // s - 脉冲动画间隔
  PULSE_ANIMATION_DURATION: 1.4, // s - 脉冲动画持续时间
  
  // Debounce timings
  PREVIEW_DEBOUNCE: 300, // ms - 预览防抖时间
  SEARCH_DEBOUNCE: 300, // ms - 搜索防抖时间
} as const;

// Size Constants
export const SIZES = {
  // Avatar sizes
  SMALL_AVATAR: { width: 8, height: 8 }, // w-8 h-8
  MEDIUM_AVATAR: { width: 10, height: 10 }, // w-10 h-10
  LARGE_AVATAR: { width: 16, height: 16 }, // w-16 h-16
  
  // Icon sizes
  SMALL_ICON: { width: 4, height: 4 }, // w-4 h-4
  MEDIUM_ICON: { width: 5, height: 5 }, // w-5 h-5
  LARGE_ICON: { width: 8, height: 8 }, // w-8 h-8
  
  // Status indicators
  STATUS_ICON: { width: 16, height: 16 }, // w-16 h-16
  
  // Skeleton sizes
  SKELETON_SMALL: 12, // w-12 h-12
  SKELETON_MEDIUM: 20, // w-20
  SKELETON_LARGE: 32, // w-32
} as const;

// Z-Index Constants
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY_HEADER: 10,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  LOADING_OVERLAY: 50,
  TOOLTIP: 60,
  NOTIFICATION: 70,
} as const;

// Color Theme Constants
export const THEME_COLORS = {
  // Status colors
  SUCCESS: {
    background: 'bg-green-100',
    text: 'text-green-600',
    border: 'border-green-300',
  },
  WARNING: {
    background: 'bg-yellow-100',
    text: 'text-yellow-600',
    border: 'border-yellow-300',
  },
  ERROR: {
    background: 'bg-red-100',
    text: 'text-red-600',
    border: 'border-red-300',
  },
  INFO: {
    background: 'bg-blue-100',
    text: 'text-blue-600',
    border: 'border-blue-300',
  },
  
  // Interactive states
  HOVER: {
    ring: 'hover:ring-2 hover:ring-gray-300',
    background: 'hover:bg-gray-50',
    text: 'hover:text-gray-700',
  },
  
  // Focus states
  FOCUS: {
    ring: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    outline: 'focus:outline-none',
  },
} as const;

// Layout Constants
export const LAYOUT = {
  // Container max widths
  MAX_WIDTH: 'max-w-7xl',
  CONTENT_PADDING: 'px-4 sm:px-6 lg:px-8',
  
  // Common spacing
  SECTION_SPACING: 'py-8',
  CARD_SPACING: 'p-6',
  FORM_SPACING: 'space-y-4',
  
  // Grid configurations
  PROJECT_GRID: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  SKELETON_GRID: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8',
} as const;

// Text Limits
export const TEXT_LIMITS = {
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  TAG_MAX_LENGTH: 20,
  MAX_TAGS: 10,
  BIO_MAX_LENGTH: 300,
} as const;

// Progress and Percentage Constants
export const PROGRESS = {
  MIN: 0,
  MAX: 100,
  STEP: 1,
} as const;

// Animation Scale Constants
export const SCALE = {
  HOVER_SCALE: 'scale-105',
  NORMAL_SCALE: 'scale-100',
  SHRINK_SCALE: 'scale-95',
} as const;

// Opacity Constants
export const OPACITY = {
  HIDDEN: 'opacity-0',
  VISIBLE: 'opacity-100',
  SEMI_TRANSPARENT: 'opacity-50',
  LOADING_OVERLAY: 'bg-white/80',
  HOVER_OVERLAY: 'bg-black bg-opacity-0 group-hover:bg-opacity-20',
} as const; 