var path = require('path');
var name = require('../package.json').name;
var loaders = require('./loaders');
var preLoaders = require('./preLoaders');
var plugins = require('./plugins');

module.exports = {
  entry: [
    './src'
  ],
  output: {
    path: path.resolve(__dirname, './../dist'),
    filename: name + '.js',
    libraryTarget: 'umd'
  },
  externals: {
    'react': 'commonjs react',
    'react-dom' : 'commonjs react-dom'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    preLoaders,
    loaders
  },
  plugins
}
