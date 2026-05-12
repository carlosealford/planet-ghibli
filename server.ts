import path from "path";
import express from "express";
import webpack from "webpack";
import webpackConfig from "./webpack.config.ts";
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const app = express();
const compiler = webpack(webpackConfig);

// make sure publicPath is available
const webpackConfigOutput = webpackConfig.output;
if (typeof webpackConfigOutput !== 'object') {
  throw new Error('Webpack configuration file "output" is not setup properly or missing');
}

// Attach dev middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfigOutput.publicPath,
  })
);

// Attach hot middleware
app.use(webpackHotMiddleware(compiler));

// Static file serving fallback (if needed)
app.use(express.static('dist'));


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