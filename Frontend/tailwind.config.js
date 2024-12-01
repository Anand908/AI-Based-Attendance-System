/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'tshadow': '2px 4px 6px black',
      },
      boxShadow: {
        'bIn': 'inset -5px -5px 10px rgba(255,255,255,0.1), inset 5px 5px 15px rgba(0,0,0,0.5)',
        'bOut': '-5px -5px 10px rgba(255,255,255,0.1), 5px 5px 15px rgba(0,0,0,0.5)',
        'inputIn': 'inset -2px -2px 6px rgba(255,255,255,0.1), inset 2px 2px 6px rgba(0,0,0,0.8)',
        'inputOut': '-2px -2px 6px rgba(255,255,255,0.1), 2px 2px 6px rgba(0,0,0,0.8)',
      },
      colors: {
        'deep-blue': '#1e3a8a',
        'bgLight': '#152e4d',
        'bgDark': '#12263f',
        'tdhclr': '#00ffff',
        'tdclr': '#fff',
    },},
  },
  plugins: [],
}