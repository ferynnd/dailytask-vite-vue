// tailwind.config.js
module.exports = {
    darkMode: 'class', // atau 'media'
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
            sans: ['Poppins', 'ui-sans-serif', 'system-ui'], // Ganti 'Poppins' sesuai font yang diimport
          },
      },
    },
    plugins: [],
  }