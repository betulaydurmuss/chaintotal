/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk color palette
        background: '#0A0E27',
        surface: '#12151F',
        border: '#1E2139',
        primary: {
          DEFAULT: '#00D9FF',
          dark: '#00A8CC',
          light: '#33E1FF',
        },
        accent: {
          DEFAULT: '#B100FF',
          dark: '#8800CC',
          light: '#C433FF',
        },
        success: '#00FF00',
        warning: '#FFB800',
        danger: '#FF0055',
        text: {
          primary: '#FFFFFF',
          secondary: '#A0AEC0',
          muted: '#718096',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 217, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(177, 0, 255, 0.5)',
        'glow-success': '0 0 20px rgba(0, 255, 0, 0.5)',
        'glow-danger': '0 0 20px rgba(255, 0, 85, 0.5)',
      },
    },
  },
  plugins: [],
}
