const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, "./index.js"),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    modules: [ "node_modules"],
    extensions: ['.js'],
  }
};