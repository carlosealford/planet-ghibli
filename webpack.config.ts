import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// TODO: PUT CSS INAN EXTERNAL FILE ASWELL AS INTERNAL

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const config: webpack.Configuration = {
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
    publicPath: './',
    clean: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/templates/index.html",
      chunks: ["main"],
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
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
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
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  }
};
