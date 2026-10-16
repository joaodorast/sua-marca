/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        shell: '#FCF5F6', // off-white rosado
        blush: '#F6DDE2', // rosa blush
        petal: '#EFC3CD', // rosa suave
        rose: '#DFA0AF', // rosa médio
        burnt: '#C77F91', // rosa queimado (detalhes, grafismos)
        roseink: '#9E5869', // rosa queimado escurecido p/ texto pequeno (contraste AA)
        wine: '#754653', // bordô
        plum: '#3B2329', // bordô profundo p/ seções escuras
        stone: '#746B6D', // cinza quente
        ink: '#292326', // preto suave
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Cormorant', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Manrope', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      letterSpacing: { label: '0.22em' },
      maxWidth: { page: '1400px' },
      transitionTimingFunction: { silk: 'cubic-bezier(.22,.61,.36,1)' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        spinslow: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        spinslow: 'spinslow 28s linear infinite',
      },
    },
  },
  plugins: [],
}
