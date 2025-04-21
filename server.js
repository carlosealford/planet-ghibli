const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const app = express();
const compiler = webpack(webpackConfig);

// Attach dev middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
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
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});