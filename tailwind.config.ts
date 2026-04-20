import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F0FE',
          100: '#EADEFC',
          200: '#D5BCF9',
          300: '#B994F4',
          400: '#9968EC',
          500: '#7E43E0',
          600: '#6D28D9',
          700: '#5B1FB5',
          800: '#481A90',
          900: '#311263',
        },
        accent: {
          50: '#EFFCF2',
          100: '#D6F7DE',
          200: '#AEEEBE',
          300: '#7FDF97',
          400: '#4ECB72',
          500: '#22B556',
          600: '#16A34A',
          700: '#11803A',
          800: '#0E652E',
          900: '#0A4A21',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#E4E7EC',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1D2939',
          900: '#101828',
        },
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      borderRadius: {
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(16, 24, 40, 0.04), 0 1px 3px 0 rgba(16, 24, 40, 0.06)',
        card: '0 4px 12px -2px rgba(16, 24, 40, 0.06), 0 2px 4px -2px rgba(16, 24, 40, 0.04)',
        'card-lg': '0 10px 24px -6px rgba(16, 24, 40, 0.08), 0 4px 8px -4px rgba(16, 24, 40, 0.04)',
      },
      maxWidth: {
        container: '1200px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 400ms ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
