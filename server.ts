import path from "path";
import { fileURLToPath } from "node:url";
import express from "express";
import webpack, { type Configuration } from "webpack";
import webpackConfig from "./webpack.config.ts";
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const config: Configuration = webpackConfig({}, { mode: "development" });
const compiler = webpack(config);

// make sure publicPath is available
if (!config.output || typeof config.output === "string") {
  throw new Error('Webpack output configuration is invalid.');
}

// Attach dev middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath || "/",
    writeToDisk: false,
  })
);

// Attach hot middleware
app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/film', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/film.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});