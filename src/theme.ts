// Central colours, spacing and text sizes so every screen shares the same look.

export const colors = {
  primary: '#2E3A59', // navy used for buttons and the selected state in the wireframes
  primaryText: '#FFFFFF',
  background: '#F6F7F9',
  surface: '#FFFFFF',
  header: '#EEF0F3',
  border: '#D6DAE1',
  text: '#1F2433',
  textMuted: '#6B7280',
  placeholder: '#9AA1AD',
  error: '#C0392B',
  errorBackground: '#FDECEA',
  success: '#1E7E4A',
  successBackground: '#E6F4EC',
};

// Badge colours for each course, so the chef can tell courses apart at a glance.
export const courseColors: Record<string, { background: string; text: string }> = {
  Starter: { background: '#E8F1FB', text: '#2563A8' },
  'Main Course': { background: '#FFF3E0', text: '#B45309' },
  Dessert: { background: '#F5E9F7', text: '#8E3B9E' },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const fontSizes = {
  small: 12,
  body: 15,
  label: 14,
  title: 20,
  heading: 17,
};

export const radius = 8;
