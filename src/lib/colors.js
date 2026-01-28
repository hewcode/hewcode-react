// Helper function to determine text color based on background color
export const getContrastColor = (hexColor) => {
  if (!hexColor) return '#ffffff';

  // Remove # if present
  const color = hexColor.replace('#', '');

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Common color name to Tailwind class mappings
export const TAILWIND_COLOR_MAP = {
  // Semantic colors
  'danger': {
    bg: 'bg-red-50 dark:bg-red-950/50',
    badge: 'bg-red-500 text-white',
    badgeDark: 'dark:bg-red-600'
  },
  'warning': {
    bg: 'bg-yellow-50 dark:bg-yellow-950/50',
    badge: 'bg-yellow-500 text-white',
    badgeDark: 'dark:bg-yellow-600'
  },
  'success': {
    bg: 'bg-green-50 dark:bg-green-950/50',
    badge: 'bg-green-500 text-white',
    badgeDark: 'dark:bg-green-600'
  },
  'info': {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    badge: 'bg-blue-500 text-white',
    badgeDark: 'dark:bg-blue-600'
  },
  'primary': {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    badge: 'bg-blue-500 text-white',
    badgeDark: 'dark:bg-blue-600'
  },
  'secondary': {
    bg: 'bg-gray-50 dark:bg-gray-950/50',
    badge: 'bg-gray-500 text-white',
    badgeDark: 'dark:bg-gray-600'
  },

  // Direct color names
  'red': {
    bg: 'bg-red-50 dark:bg-red-950/50',
    badge: 'bg-red-500 text-white',
    badgeDark: 'dark:bg-red-600'
  },
  'orange': {
    bg: 'bg-orange-50 dark:bg-orange-950/50',
    badge: 'bg-orange-500 text-white',
    badgeDark: 'dark:bg-orange-600'
  },
  'amber': {
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    badge: 'bg-amber-500 text-black',
    badgeDark: 'dark:bg-amber-600 dark:text-white'
  },
  'yellow': {
    bg: 'bg-yellow-50 dark:bg-yellow-950/50',
    badge: 'bg-yellow-500 text-black',
    badgeDark: 'dark:bg-yellow-600 dark:text-white'
  },
  'lime': {
    bg: 'bg-lime-50 dark:bg-lime-950/50',
    badge: 'bg-lime-500 text-black',
    badgeDark: 'dark:bg-lime-600 dark:text-white'
  },
  'green': {
    bg: 'bg-green-50 dark:bg-green-950/50',
    badge: 'bg-green-500 text-white',
    badgeDark: 'dark:bg-green-600'
  },
  'emerald': {
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badge: 'bg-emerald-500 text-white',
    badgeDark: 'dark:bg-emerald-600'
  },
  'teal': {
    bg: 'bg-teal-50 dark:bg-teal-950/50',
    badge: 'bg-teal-500 text-white',
    badgeDark: 'dark:bg-teal-600'
  },
  'cyan': {
    bg: 'bg-cyan-50 dark:bg-cyan-950/50',
    badge: 'bg-cyan-500 text-white',
    badgeDark: 'dark:bg-cyan-600'
  },
  'sky': {
    bg: 'bg-sky-50 dark:bg-sky-950/50',
    badge: 'bg-sky-500 text-white',
    badgeDark: 'dark:bg-sky-600'
  },
  'blue': {
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    badge: 'bg-blue-500 text-white',
    badgeDark: 'dark:bg-blue-600'
  },
  'indigo': {
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    badge: 'bg-indigo-500 text-white',
    badgeDark: 'dark:bg-indigo-600'
  },
  'violet': {
    bg: 'bg-violet-50 dark:bg-violet-950/50',
    badge: 'bg-violet-500 text-white',
    badgeDark: 'dark:bg-violet-600'
  },
  'purple': {
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    badge: 'bg-purple-500 text-white',
    badgeDark: 'dark:bg-purple-600'
  },
  'fuchsia': {
    bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/50',
    badge: 'bg-fuchsia-500 text-white',
    badgeDark: 'dark:bg-fuchsia-600'
  },
  'pink': {
    bg: 'bg-pink-50 dark:bg-pink-950/50',
    badge: 'bg-pink-500 text-white',
    badgeDark: 'dark:bg-pink-600'
  },
  'rose': {
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    badge: 'bg-rose-500 text-white',
    badgeDark: 'dark:bg-rose-600'
  },
  'gray': {
    bg: 'bg-gray-50 dark:bg-gray-950/50',
    badge: 'bg-gray-500 text-white',
    badgeDark: 'dark:bg-gray-600'
  },
  'slate': {
    bg: 'bg-slate-50 dark:bg-slate-950/50',
    badge: 'bg-slate-500 text-white',
    badgeDark: 'dark:bg-slate-600'
  },
  'zinc': {
    bg: 'bg-zinc-50 dark:bg-zinc-950/50',
    badge: 'bg-zinc-500 text-white',
    badgeDark: 'dark:bg-zinc-600'
  },
  'neutral': {
    bg: 'bg-neutral-50 dark:bg-neutral-950/50',
    badge: 'bg-neutral-500 text-white',
    badgeDark: 'dark:bg-neutral-600'
  },
  'stone': {
    bg: 'bg-stone-50 dark:bg-stone-950/50',
    badge: 'bg-stone-500 text-white',
    badgeDark: 'dark:bg-stone-600'
  },
};

// Helper function to get Tailwind background class for rows
export const getTailwindBgClass = (color) => {
  if (!color) return '';

  // If it's already a hex color, return empty (will use inline style)
  if (color.startsWith('#')) return '';

  const colorConfig = TAILWIND_COLOR_MAP[color.toLowerCase()];
  return colorConfig ? colorConfig.bg : '';
};

// Helper function to get Tailwind classes for badges
export const getTailwindBadgeClasses = (color) => {
  if (!color) return '';

  // If it's already a hex color, return empty (will use inline style)
  if (color.startsWith('#')) return '';

  const colorConfig = TAILWIND_COLOR_MAP[color.toLowerCase()];
  if (!colorConfig) return '';

  return `${colorConfig.badge} ${colorConfig.badgeDark}`;
};

// Check if a color is a hex color
export const isHexColor = (color) => {
  return color && color.startsWith('#');
};

// Check if a color is a Tailwind color name
export const isTailwindColor = (color) => {
  return color && TAILWIND_COLOR_MAP[color.toLowerCase()];
};

// Helper function to get Tailwind border class for cards
export const getTailwindBorderClass = (color) => {
  if (!color) return '';

  // If it's already a hex color, return empty (will use inline style)
  if (color.startsWith('#')) return '';

  // Map colors to border classes
  const borderMap = {
    'danger': 'border-red-500',
    'warning': 'border-yellow-500',
    'success': 'border-green-500',
    'info': 'border-blue-500',
    'primary': 'border-blue-500',
    'secondary': 'border-gray-500',
    'red': 'border-red-500',
    'orange': 'border-orange-500',
    'amber': 'border-amber-500',
    'yellow': 'border-yellow-500',
    'lime': 'border-lime-500',
    'green': 'border-green-500',
    'emerald': 'border-emerald-500',
    'teal': 'border-teal-500',
    'cyan': 'border-cyan-500',
    'sky': 'border-sky-500',
    'blue': 'border-blue-500',
    'indigo': 'border-indigo-500',
    'violet': 'border-violet-500',
    'purple': 'border-purple-500',
    'fuchsia': 'border-fuchsia-500',
    'pink': 'border-pink-500',
    'rose': 'border-rose-500',
    'gray': 'border-gray-500',
    'slate': 'border-slate-500',
    'zinc': 'border-zinc-500',
    'neutral': 'border-neutral-500',
    'stone': 'border-stone-500',
  };

  return borderMap[color.toLowerCase()] || '';
};