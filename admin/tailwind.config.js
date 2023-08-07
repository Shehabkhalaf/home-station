/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        main: '#74B8B9',
        secondery: '#6DC4E8',
      },
      screens: {
        sm: '640px',
        md: '768px',
        xmd: '1007px',
        lg: '1024px',
        xl: '1300px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
