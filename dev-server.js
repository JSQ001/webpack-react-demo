const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config.js');

const test = config('test');

const options = {
  contentBase: path.resolve('test')+'/',
  hot: true,
  host: 'localhost',
  open: 'Google Chrome',    //自动打开页面
  publicPath: '/webpack-react-demo/dist/test/',
};

webpackDevServer.addDevServerEntrypoints(test, options);
const compiler = webpack(test);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});