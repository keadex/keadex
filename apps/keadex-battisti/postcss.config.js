const { join } = require('path')

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-url': {},
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.ts'),
    },
    autoprefixer: {},
  },
}
