const { join } = require('path')

module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {
      config: join(__dirname, 'tailwind.config.ts'),
    },
    autoprefixer: {},
  },
}
