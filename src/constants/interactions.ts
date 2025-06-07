// 交互状态常量定义
export const INTERACTION_STATES = {
  // 焦点状态 (Focus States)
  FOCUS: {
    // 默认焦点环
    DEFAULT: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    // 品牌色焦点环
    BRAND: 'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
    // 危险操作焦点环
    DANGER: 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    // 成功状态焦点环
    SUCCESS: 'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    // 输入框焦点
    INPUT: 'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent',
    // 卡片焦点
    CARD: 'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
  },

  // 悬停状态 (Hover States)
  HOVER: {
    // 按钮悬停
    BUTTON: 'hover:bg-opacity-90 hover:shadow-md transition-all duration-200',
    // 卡片悬停
    CARD: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
    // 链接悬停
    LINK: 'hover:text-blue-600 hover:underline transition-colors duration-200',
    // 图标悬停
    ICON: 'hover:bg-gray-100 hover:scale-105 transition-all duration-200',
  },

  // 激活/选中状态 (Active/Selected States)
  ACTIVE: {
    // 选中的按钮
    BUTTON: 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2',
    // 选中的标签页
    TAB: 'bg-blue-50 text-blue-600 border-blue-500',
    // 选中的卡片
    CARD: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-2',
    // 选中的列表项
    LIST_ITEM: 'bg-blue-50 border-l-4 border-blue-500',
  },

  // 禁用状态 (Disabled States)
  DISABLED: {
    // 禁用的按钮
    BUTTON: 'opacity-50 cursor-not-allowed pointer-events-none',
    // 禁用的输入框
    INPUT: 'opacity-50 cursor-not-allowed bg-gray-100',
    // 禁用的文本
    TEXT: 'opacity-50 cursor-not-allowed',
  },

  // 加载状态 (Loading States)
  LOADING: {
    // 加载中的按钮
    BUTTON: 'opacity-75 cursor-wait pointer-events-none',
    // 加载中的容器
    CONTAINER: 'opacity-50 pointer-events-none',
  },
} as const;

// 交互状态组合函数
export const combineInteractionStates = (...states: string[]): string => {
  return states.filter(Boolean).join(' ');
};

// 常用交互状态组合
export const COMMON_INTERACTIONS = {
  // 主要按钮的完整交互
  PRIMARY_BUTTON: combineInteractionStates(
    INTERACTION_STATES.FOCUS.BRAND,
    INTERACTION_STATES.HOVER.BUTTON,
    'transition-all duration-200'
  ),

  // 次要按钮的完整交互
  SECONDARY_BUTTON: combineInteractionStates(
    INTERACTION_STATES.FOCUS.DEFAULT,
    INTERACTION_STATES.HOVER.BUTTON,
    'transition-all duration-200'
  ),

  // 卡片的完整交互
  INTERACTIVE_CARD: combineInteractionStates(
    INTERACTION_STATES.FOCUS.CARD,
    INTERACTION_STATES.HOVER.CARD,
    'cursor-pointer transition-all duration-300'
  ),

  // 输入框的完整交互
  INPUT_FIELD: combineInteractionStates(
    INTERACTION_STATES.FOCUS.INPUT,
    'transition-all duration-200'
  ),

  // 导航链接的完整交互
  NAV_LINK: combineInteractionStates(
    INTERACTION_STATES.FOCUS.DEFAULT,
    INTERACTION_STATES.HOVER.LINK,
    'transition-all duration-200'
  ),
} as const;

// 无障碍性常量
export const ACCESSIBILITY = {
  // 键盘导航
  KEYBOARD_FOCUSABLE: 'tabindex="0"',
  KEYBOARD_SKIP: 'tabindex="-1"',
  
  // ARIA 标签
  ARIA_LABELS: {
    CLOSE: 'aria-label="关闭"',
    MENU: 'aria-label="菜单"',
    SEARCH: 'aria-label="搜索"',
    LOADING: 'aria-label="加载中"',
    ERROR: 'aria-label="错误"',
  },

  // 状态指示
  ARIA_STATES: {
    EXPANDED: 'aria-expanded',
    SELECTED: 'aria-selected',
    CURRENT: 'aria-current',
    HIDDEN: 'aria-hidden',
  },
} as const;

// 响应式交互状态
export const RESPONSIVE_INTERACTIONS = {
  // 移动端优化的交互
  MOBILE: {
    // 触摸友好的按钮
    TOUCH_BUTTON: 'min-h-[44px] min-w-[44px] touch-manipulation',
    // 触摸友好的链接
    TOUCH_LINK: 'min-h-[44px] touch-manipulation',
  },

  // 桌面端优化的交互
  DESKTOP: {
    // 鼠标悬停效果
    HOVER_ONLY: 'md:hover:shadow-lg md:hover:scale-105',
    // 精确点击
    PRECISE_CLICK: 'cursor-pointer select-none',
  },
} as const; 