export const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    error: '#F44336',
    warning: '#FF9800',
    success: '#8BC34A',
    background: '#F5F5F5',
    paper: '#FFFFFF',
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#9E9E9E',
      hint: '#BDBDBD'
    }
  },
  fonts: {
    main: "'Poppins', sans-serif"
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
    xxxl: '3rem'
  },
  spacing: (multiplier = 1) => `${0.25 * multiplier}rem`,
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    xxl: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
  },
  transitions: {
    fast: '0.1s ease',
    normal: '0.3s ease',
    slow: '0.5s ease'
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    round: '50%'
  }
}; 