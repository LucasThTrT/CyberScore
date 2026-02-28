/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#06070d',
          charcoal: '#0b1020',
          panel: '#11182b',
          cyan: '#00f5ff',
          pink: '#ff2bbf',
          purple: '#8a2bff',
          high: '#ff2b66',
          medium: '#ff9d2b',
          low: '#00f5b0',
        },
      },
      boxShadow: {
        neonCyan: '0 0 12px rgba(0,245,255,0.65), 0 0 30px rgba(0,245,255,0.25)',
        neonPink: '0 0 14px rgba(255,43,191,0.65), 0 0 34px rgba(255,43,191,0.25)',
        neonCard: '0 0 0 1px rgba(255,255,255,0.08), 0 0 24px rgba(0,245,255,0.14)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 0.75, transform: 'scaleX(1)' },
          '50%': { opacity: 1, transform: 'scaleX(1.02)' },
        },
        glowWave: {
          '0%, 100%': { filter: 'drop-shadow(0 0 0px rgba(0,245,255,0.2))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(0,245,255,0.75))' },
        },
        shakeGlow: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '50%': { transform: 'translateX(2px)' },
          '75%': { transform: 'translateX(-1px)' },
        },
        gridDrift: {
          '0%': { backgroundPosition: '0 0, 0 0' },
          '100%': { backgroundPosition: '120px 120px, 40px 0' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 2.8s ease-in-out infinite',
        glowWave: 'glowWave 2.4s ease-in-out infinite',
        shakeGlow: 'shakeGlow 0.45s ease-in-out 2',
        gridDrift: 'gridDrift 14s linear infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
