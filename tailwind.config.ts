/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E86AB',
        accent: '#76C7C0',
        warning: '#F4D35E',
        darkText: '#1C1F26',
        softWhite: '#F5F9FF',
      },
      animation: {
         'fade-in': 'fadeIn 0.5s ease-out forwards',
         'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
         'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
         fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
         fadeInUp: {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
         },
         slideUp: {
            '0%': { opacity: 0, transform: 'translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' },
         },
      },
    },
  },
  plugins: [],
}