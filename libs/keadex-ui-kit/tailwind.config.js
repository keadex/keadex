/** @type {import('tailwindcss').Config} */
const { join } = require('path')
const { neutral } = require('tailwindcss/colors')

module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    '../../node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: neutral[800],
        secondary: neutral[700],
        third: neutral[600],
        'accent-primary': neutral[300],
        'accent-secondary': neutral[400],
        'accent-third': neutral[500],
        link: '#3867B1',
        brand1: '#3867B1',
        brand2: '#AFB7C3',
        brand3: '#D6E2F4',
        'dark-primary': '#181818',
        'dark-brand1': '#1b355f',
      },
    },
  },
  plugins: [require('tw-elements/dist/plugin.cjs')],
}
