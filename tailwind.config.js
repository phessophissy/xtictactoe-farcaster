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
        wood: {
          50: '#f7f3ef',
          100: '#efe5d8',
          200: '#dfc8b0',
          300: '#cba583',
          400: '#b67f56',
          500: '#9f5f36',
          600: '#8d4b2e',
          700: '#753b26',
          800: '#623223',
          900: '#512a1f',
          950: '#2b1510',
        },
        metal: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        bronze: {
          light: '#d6a374',
          mid: '#b08d5b',
          dark: '#8a7148',
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite',
        'cell-win': 'metalCellWin 0.8s ease-out forwards',
        'bounce-in': 'metalPlace 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'metal-shine': 'metalShineSweep 4s ease-in-out infinite',
        'float-metal': 'floatMetal1 20s ease-in-out infinite',
        'pulse-metal': 'metalPulse 2s ease-in-out infinite',
        'marker-pulse': 'markerPulse 2s ease-in-out infinite',
        'victory-glow': 'victoryGlow 1.5s ease-in-out infinite',
        'text-shimmer': 'textShimmer 3s ease-in-out infinite',
        'indicator-pulse': 'indicatorPulse 2s ease-in-out infinite',
        'turn-pulse': 'turnPulse 1.5s ease-in-out infinite',
        'timer-urgent': 'timerUrgent 1s ease-in-out infinite',
        'ripple-expand': 'rippleExpand 0.6s ease-out forwards',
        'particle-fly': 'particleFly 1s ease-out forwards',
        'metal-spin': 'metalSpin 1s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'rotate-in': 'rotateIn 0.6s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'flash': 'flash 1s ease-in-out infinite',
        'rubber-band': 'rubberBand 1s ease-out',
        'jello': 'jello 1s ease-in-out',
        'tada': 'tada 1s ease-out',
        'swing': 'swing 1s ease-in-out infinite',
        'wobble': 'wobble 1s ease-in-out',
        'flip': 'flip 0.6s ease-out',
        'bounce-out': 'bounceOut 0.5s ease-out forwards',
        'zoom-in': 'zoomIn 0.4s ease-out forwards',
        'zoom-out': 'zoomOut 0.4s ease-out forwards',
        'metal-shimmer': 'metalShimmer 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'glow-pulse-metal': 'glowPulseMetal 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 10px rgba(156, 163, 175, 0.3), 0 0 20px rgba(107, 114, 128, 0.2)',
          },
          '50%': {
            boxShadow: '0 0 25px rgba(209, 213, 219, 0.5), 0 0 40px rgba(156, 163, 175, 0.3)',
          },
        },
        'metalCellWin': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          },
          '50%': {
            transform: 'scale(1.2) rotate(-2deg)',
            boxShadow: '0 0 50px rgba(209,213,219,0.6), 0 0 80px rgba(156,163,175,0.4)',
          },
          '100%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px rgba(209,213,219,0.4), 0 0 50px rgba(156,163,175,0.2)',
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
        'metalPulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(156,163,175,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(209,213,219,0.3), 0 0 60px rgba(156,163,175,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
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
            filter: 'drop-shadow(0 0 10px rgba(117,59,38,0.5)) brightness(1)',
          },
          '50%': {
            filter: 'drop-shadow(0 0 30px rgba(159,95,54,0.8)) brightness(1.2)',
          },
        },
        'textShimmer': {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.2)' },
        },
        'indicatorPulse': {
          '0%, 100%': {
            boxShadow: '0 0 8px #9ca3af, 0 0 16px rgba(156,163,175,0.4)',
          },
          '50%': {
            boxShadow: '0 0 15px #9ca3af, 0 0 30px rgba(156,163,175,0.6)',
          },
        },
        'turnPulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 10px rgba(156,163,175,0.3)',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 25px rgba(209,213,219,0.5)',
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
        'fadeIn': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slideUp': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slideDown': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slideLeft': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slideRight': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scaleIn': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotateIn': {
          '0%': { transform: 'rotate(-180deg) scale(0)', opacity: '0' },
          '100%': { transform: 'rotate(0deg) scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.1)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        'flash': {
          '0%, 50%, 100%': { opacity: '1' },
          '25%, 75%': { opacity: '0' },
        },
        'rubberBand': {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scaleX(1.25) scaleY(0.75)' },
          '40%': { transform: 'scaleX(0.75) scaleY(1.25)' },
          '50%': { transform: 'scaleX(1.15) scaleY(0.85)' },
          '65%': { transform: 'scaleX(0.95) scaleY(1.05)' },
          '75%': { transform: 'scaleX(1.05) scaleY(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'jello': {
          '0%, 100%': { transform: 'skewX(0deg) skewY(0deg)' },
          '11.1%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
          '22.2%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
          '33.3%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
          '44.4%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
          '55.5%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
          '66.6%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
          '77.7%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
        },
        'tada': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
          '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
          '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        },
        'swing': {
          '0%, 100%': { transform: 'rotate(0deg)', transformOrigin: 'top center' },
          '20%': { transform: 'rotate(15deg)' },
          '40%': { transform: 'rotate(-10deg)' },
          '60%': { transform: 'rotate(5deg)' },
          '80%': { transform: 'rotate(-5deg)' },
        },
        'wobble': {
          '0%': { transform: 'translateX(0%)' },
          '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
          '30%': { transform: 'translateX(20%) rotate(3deg)' },
          '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
          '60%': { transform: 'translateX(10%) rotate(2deg)' },
          '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'flip': {
          '0%': { transform: 'perspective(400px) rotateY(0)', opacity: '1' },
          '40%': { transform: 'perspective(400px) rotateY(-180deg)' },
          '100%': { transform: 'perspective(400px) rotateY(-360deg)', opacity: '1' },
        },
        'bounceOut': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '20%': { transform: 'scale(0.9)' },
          '50%, 55%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'zoomIn': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'zoomOut': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0)', opacity: '0' },
        },
        'metalShimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.8)' },
        },
        'glowPulseMetal': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(156,163,175,0.3), 0 0 10px rgba(156,163,175,0.2)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(209,213,219,0.5), 0 0 40px rgba(156,163,175,0.3)',
          },
        },
      },
      backgroundImage: {
        'metal-gradient': 'linear-gradient(180deg, #d1d5db 0%, #9ca3af 40%, #6b7280 60%, #9ca3af 100%)',
        'wood-gradient': 'linear-gradient(180deg, #cba583 0%, #9f5f36 25%, #753b26 50%, #9f5f36 75%, #cba583 100%)',
        'card-metal': 'linear-gradient(145deg, #1f2937 0%, #111827 50%, #030712 100%)',
      },
      boxShadow: {
        'metal': '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.3)',
        'metal-hover': '0 6px 25px rgba(0,0,0,0.5), 0 0 20px rgba(156,163,175,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
        'metal-inset': 'inset 0 2px 5px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
}
