module.exports = {
  mode: 'jit',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridTemplateRows: {
        // Simple 8 row grid
        8: 'repeat(8, minmax(0, 1fr))',
      },
      fontFamily: {
        heading: ['Fredoka', 'Work', 'Sans'],
      },
      colors: {
        skyBlue: '#85dfef',
      },
      backgroundImage: (theme) => ({
        'chat-widget': "url('../public/images/background.png')",
      }),
    },
  },
  plugins: [],
}
