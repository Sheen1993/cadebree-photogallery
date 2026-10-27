import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        love: {
          // The two signature accents
          sky: '#90D5FF',
          lilac: '#DFC5FE',
          // Deeper companions for text and icons, where the pastels lack contrast
          'sky-deep': '#2F8FCB',
          'lilac-deep': '#8B5CD6',
          // Supporting paper tones for the notes wall
          blush: '#FFE0EC',
          cream: '#FFF7E3',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      opacity: {
        15: '0.15',
      },
      boxShadow: {
        glow: '0 18px 45px -12px rgba(144, 213, 255, 0.65), 0 12px 40px -14px rgba(223, 197, 254, 0.8)',
        'glow-lg': '0 30px 70px -20px rgba(144, 213, 255, 0.75), 0 25px 60px -18px rgba(223, 197, 254, 0.9)',
        paper: '0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 28px -10px rgba(15, 23, 42, 0.22)',
      },
      backgroundImage: {
        'love-gradient': 'linear-gradient(135deg, #90D5FF 0%, #DFC5FE 100%)',
        'love-gradient-deep': 'linear-gradient(135deg, #2F8FCB 0%, #8B5CD6 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '85%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-15%)', opacity: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'translateX(-14px) rotate(-12deg)' },
          '50%': { transform: 'translateX(14px) rotate(12deg)' },
        },
        equalizer: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        'float-up': 'float-up 18s linear infinite',
        sway: 'sway 4s ease-in-out infinite',
        equalizer: 'equalizer 0.9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
