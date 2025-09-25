// Pega esto en tu archivo tailwind.config.js o tailwind.config.ts

/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}', // Importante por tu estructura de carpetas
  ],
  
  // 3. Define tu tema
  theme: {
    extend: {
      fontFamily: {
        cabin: ['Cabin', 'sans-serif'],
      },
    },
  },
  
  // 4. Añade plugins si los necesitas
  plugins: [],
}