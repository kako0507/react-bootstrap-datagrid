var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    simple: './simple/app.js',
    fixedGridHeight: './fixedGridHeight/app.js'
  },
  output: {
    path: __dirname,
    filename: '[name]/app.bundle.js',
  },
  module:{
    loaders: [
      {
        test: /\.js$/,
        // Skip any files outside of your project's `src` directory
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          plugins: ['transform-decorators-legacy'],
          presets: ['es2015','react','stage-0']
        }
      }
    ]
  }
};
