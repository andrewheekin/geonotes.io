/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'radial-gradient': 'radial-gradient(white, transparent)',
        'conic-gradient': 'conic-gradient(#87CEEB, #ADD8E6)',
        'dark-radial-gradient': 'radial-gradient(black, transparent)',
        'dark-conic-gradient': 'conic-gradient(#1e40af, #000000)',
      },
      blur: {
        '50': '50px',
      },
    },
  },
  plugins: [],
};
