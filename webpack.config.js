const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// TODO: PUT CSS INAN EXTERNAL FILE ASWELL AS INTERNAL

module.exports = {
  entry: {
    main: [
      'webpack-hot-middleware/client?reload=true',
      './src/index.js'
    ],
    film: [
      'webpack-hot-middleware/client?reload=true',
      './src/film.js'
    ],
  },
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/templates/index.html",
      chunks: ["index"],
    }),
    new HtmlWebpackPlugin({
      filename: "film.html",
      template: "./src/templates/film.html",
      chunks: ["film"],
    })
  ],
  module: {
    // use two loaders for css and css modules
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      }
    ]
  }
};