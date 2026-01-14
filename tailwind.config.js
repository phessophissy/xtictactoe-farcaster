/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        metal: {
          50: '#fafafa',
          100: '#e0e0e0',
          200: '#c0c0c0',
          300: '#a0a0a0',
          400: '#808080',
          500: '#606060',
          600: '#4a4a4a',
          700: '#3a3a3a',
          800: '#2a2a2a',
          900: '#1a1a1a',
        },
        chrome: {
          light: '#ffffff',
          mid: '#c0c0c0',
          dark: '#808080',
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        'cell-win': 'metalCellWin 0.8s ease-out forwards',
        'bounce-in': 'metalPlace 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'metal-shine': 'metalShineSweep 4s ease-in-out infinite',
        'float-metal': 'floatMetal1 20s ease-in-out infinite',
        'pulse-metal': 'metallicPulse 2s ease-in-out infinite',
        'marker-pulse': 'markerPulse 2s ease-in-out infinite',
        'victory-glow': 'victoryGlow 1.5s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
        'indicator-pulse': 'indicatorPulse 2s ease-in-out infinite',
        'turn-pulse': 'turnPulse 1.5s ease-in-out infinite',
        'timer-urgent': 'timerUrgent 1s ease-in-out infinite',
        'ripple-expand': 'rippleExpand 0.6s ease-out forwards',
        'particle-fly': 'particleFly 1s ease-out forwards',
        'metal-spin': 'metalSpin 1s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 10px rgba(150, 150, 150, 0.3), 0 0 20px rgba(150, 150, 150, 0.2)',
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(180, 180, 180, 0.5), 0 0 40px rgba(150, 150, 150, 0.3)',
          },
        },
        'metalCellWin': {
          '0%': { 
            transform: 'scale(1)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          },
          '50%': { 
            transform: 'scale(1.2) rotate(-2deg)',
            boxShadow: '0 0 50px rgba(220,220,220,0.6), 0 0 80px rgba(180,180,180,0.4)',
          },
          '100%': { 
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px rgba(180,180,180,0.4), 0 0 50px rgba(150,150,150,0.2)',
          },
        },
        'metalPlace': {
          '0%': {
            transform: 'scale(0) rotate(-180deg)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.2) rotate(10deg)',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
        },
        'metalShineSweep': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'floatMetal1': {
          '0%, 100%': { 
            transform: 'rotate(-15deg) translateY(0px) scale(1)',
            filter: 'brightness(1)',
          },
          '50%': { 
            transform: 'rotate(-15deg) translateY(-35px) scale(1.02)',
            filter: 'brightness(1.2)',
          },
        },
        'metallicPulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(150,150,150,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(180,180,180,0.3), 0 0 60px rgba(150,150,150,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
          },
        },
        'markerPulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4)) brightness(1)',
          },
          '50%': {
            transform: 'scale(1.05)',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5)) brightness(1.1)',
          },
        },
        'victoryGlow': {
          '0%, 100%': {
            filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5)) brightness(1)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.8)) brightness(1.2)',
          },
        },
        'textShimmer': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.2)' },
        },
        'indicatorPulse': {
          '0%, 100%': {
            boxShadow: '0 0 8px #7cb342, 0 0 16px rgba(124,179,66,0.4)',
          },
          '50%': {
            boxShadow: '0 0 15px #7cb342, 0 0 30px rgba(124,179,66,0.6)',
          },
        },
        'turnPulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(150,150,150,0.3)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px rgba(180,180,180,0.5)',
          },
        },
        'timerUrgent': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'rippleExpand': {
          '0%': { width: '0', height: '0', opacity: '1' },
          '100%': { width: '200px', height: '200px', marginLeft: '-100px', marginTop: '-100px', opacity: '0' },
        },
        'particleFly': {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx, 50px), var(--ty, -50px)) scale(0)', opacity: '0' },
        },
        'metalSpin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(180deg, #5a5a5a 0%, #3a3a3a 40%, #2a2a2a 60%, #3a3a3a 100%)',
        'chrome-gradient': 'linear-gradient(180deg, #ffffff 0%, #c0c0c0 25%, #808080 50%, #a0a0a0 75%, #ffffff 100%)',
        'card-metal': 'linear-gradient(145deg, #3a3a3a 0%, #2a2a2a 50%, #1f1f1f 100%)',
      },
      boxShadow: {
        'metal': '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)',
        'metal-hover': '0 6px 25px rgba(0,0,0,0.5), 0 0 20px rgba(150,150,150,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
        'metal-inset': 'inset 0 2px 5px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
