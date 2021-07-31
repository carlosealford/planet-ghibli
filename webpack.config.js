const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// TODO: PUT CSS INAN EXTERNAL FILE ASWELL AS INTERNAL

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
  module: {
    // use two loaders for css and css modules
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ],
      }
    ]
  }
};
