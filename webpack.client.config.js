const path = require('path')

module.exports = {
  mode: 'development',
  entry: './public/player/javascripts/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'player.bundle.js'
  },
}