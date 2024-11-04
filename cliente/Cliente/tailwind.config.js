/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Asegúrate de incluir todos los tipos de archivos relevantes
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0A0F29',
        'neon-green': '#00FF9F',
        'neon-purple': '#8F00FF',
        'bright-cyan': '#00E5FF',
        'light-gray': '#B3B3B3',
        'neon-pink': '#FF007A',
        'dark-blue': '#1B263B',
        'metallic-silver': '#C0C0C0',
      },
    },
  },
  plugins: [],
};
