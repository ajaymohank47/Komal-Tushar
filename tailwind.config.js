/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#fdfcf9',
          100: '#faf6ee', // Warm cream background from reference
          200: '#f5ecd9',
          300: '#ebdcc0',
        },
        espresso: {
          950: '#110b07',
          900: '#1b140e', // Countdown dark brown from reference
          850: '#221912',
          800: '#2b2017',
          700: '#382a1f',
          text: '#281c14',
          muted: '#685647',
        },
        gold: {
          50: '#fdfbf2',
          100: '#faedd5',
          200: '#f5daa9',
          300: '#ecc073',
          400: '#e5c158',
          500: '#d4af37', // regal wedding gold
          600: '#b88e22',
          700: '#967119',
          800: '#795717',
        },
        crimson: {
          50: '#fcf3f3',
          500: '#8b2635', // royal ruby crimson accent
          600: '#771d2b',
          700: '#5c1420',
        },
        rose: {
          accent: '#D4848A', // Custom wedding blush pink
          50: '#fdf4f5',
          100: '#fae6e7',
          300: '#e8aeb3',
          400: '#de999f',
          500: '#D4848A',
          600: '#bd6c72',
        }
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        playfair: ['"Playfair Display"', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'wedding': '0 10px 30px -5px rgba(27, 20, 14, 0.08), 0 0 0 1px rgba(212, 175, 55, 0.15)',
        'wedding-hover': '0 20px 40px -10px rgba(27, 20, 14, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.35)',
      }
    },
  },
  plugins: [],
}
