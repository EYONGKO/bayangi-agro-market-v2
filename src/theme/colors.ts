// Global Color Theme for Bayangi Agro Market
export const theme = {
  colors: {
    // Primary brand colors (derived from agro market logo)
    primary: {
      main: '#2d5016',      // Deep forest green - primary brand color
      dark: '#1a3009',      // Darker green for hover states
      light: '#4a7c2e',     // Lighter green for accents
      background: '#f0f7e6', // Very light green for hover backgrounds
    },
    
    // Neutral colors
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9', 
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    
    // Semantic colors
    semantic: {
      success: '#16a34a',
      warning: '#d97706', 
      error: '#dc2626',
      info: '#0ea5e9',
    },
    
    // Common UI colors
    ui: {
      white: '#ffffff',
      black: '#000000',
      border: '#d4d4d8',
      shadow: 'rgba(0, 0, 0, 0.08)',
    }
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1400px',
  },
  
  // Common spacing values
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  
  // Border radius values
  borderRadius: {
    sm: '6px',
    md: '8px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  
  // Font sizes
  fontSizes: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
  }
};

// Helper functions for common color patterns
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = theme.colors;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

export const getResponsiveValue = (mobile: string, tablet?: string, desktop?: string) => ({
  '@media (max-width: 768px)': mobile,
  ...(tablet && { '@media (max-width: 1024px)': tablet }),
  ...(desktop && { '@media (min-width: 1025px)': desktop }),
});
