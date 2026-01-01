import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Sage Green
        sage: {
          DEFAULT: '#7C9885',
          light: '#A8C5B0',
          dark: '#5A7360',
          50: '#F0F5F1',
          100: '#E1EBE3',
          200: '#C3D7C7',
          300: '#A8C5B0',
          400: '#8FB09A',
          500: '#7C9885',
          600: '#5A7360',
          700: '#4A5F4F',
          800: '#3A4B3E',
          900: '#2A372D',
        },
        // Secondary - Warm neutrals
        sand: {
          DEFAULT: '#F5F0E8',
          light: '#FAF8F5',
          dark: '#E8E0D5',
        },
        cream: '#FAF8F5',
        beige: '#E8E0D5',
        // Accent colors
        coral: {
          DEFAULT: '#E8A598',
          light: '#F5C4BB',
          dark: '#C97B7B',
        },
        calm: {
          DEFAULT: '#8BA4B4',
          light: '#B0C5D1',
          dark: '#6B8899',
        },
        gold: {
          DEFAULT: '#D4B896',
          light: '#E8D4BC',
          dark: '#B89B6A',
        },
        // Semantic colors
        success: '#7C9885',
        warning: '#D4A574',
        error: '#C97B7B',
        info: '#8BA4B4',
        // Risk levels
        risk: {
          low: '#7C9885',
          moderate: '#D4A574',
          high: '#C97B7B',
          critical: '#9B4D4D',
        },
        // Text colors
        text: {
          primary: '#2D3436',
          secondary: '#636E72',
          muted: '#9CA3A8',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
