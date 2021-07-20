const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    film: './src/film.js',
  },
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
};
