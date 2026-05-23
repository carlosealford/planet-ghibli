import path from "node:path";
import { fileURLToPath } from "node:url";

import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import type { Configuration } from "webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// help simplify entries
const hotClient = "webpack-hot-middleware/client?reload=true";

export default (
  _env: unknown,
  argv: { mode?: string }
): Configuration => {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    mode: isProduction ? "production" : "development",
    target: "web",
    devtool: isProduction
      ? "source-map"
      : "eval-cheap-module-source-map",
    cache: {
      type: "filesystem",
    },
    stats: "minimal",
    entry: {
      main: [
        ...(isDevelopment ? [hotClient] : []),
        "./src/index.ts"
      ],
      film: [
        ...(isDevelopment ? [hotClient]: []),
        "./src/film.ts"
      ],
    },
    output: {
      filename: isProduction
        ? "assets/js/[name].[contenthash].js"
        : "assets/js/[name].bundle.js",
      chunkFilename: isProduction
        ? "assets/js/[name].[contenthash].chunk.js"
        : "assets/js/[name].chink.js",
      assetModuleFilename:
      "assets/media/[hash][ext][query]",
      path: path.resolve(__dirname, "dist"),
      publicPath: "/",
      clean: true,
    },
    optimization: {
      minimize: isProduction,
      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
    plugins: [
      ...(isDevelopment
        ? [new webpack.HotModuleReplacementPlugin(),]
        : []
      ),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: "assets/css/[name].[contenthash].css",
              chunkFilename: "assets/css/[name].[contenthash].chunk.css"
            }),
          ]
        : []
      ),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/templates/index.html",
        chunks: ["main"],
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
      }),
      new HtmlWebpackPlugin({
        filename: "film.html",
        template: "./src/templates/film.html",
        chunks: ["film"],
        minify: isProduction
          ? {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
            }
          : false,
      }),
    ],
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "swc-loader",
            options: {
              sourceMaps: isDevelopment,
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDevelopment,
                    refresh: isDevelopment,
                  },
                },
                target: "es2017",
              },
              minify: isProduction,
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            isProduction
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: isDevelopment,
                importLoaders: 1,
              },
            },
          ],
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024,
            }
          },
          generator: {
            filename: "assets/images/[hash][ext][query]",
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[hash][ext][query]"
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    performance: {
      hints: isProduction ? "warning" : false,
    }
  };
}
