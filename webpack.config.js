var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/components/Table.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    library: 'ReactTable',
    libraryTarget: 'umd'
  },
  externals: [
    {
      'react': {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    },
    {
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ],
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
      },
      {
        test: /\.css$/,
        loaders: ['style','css']
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]',
          'autoprefixer?browsers=last 2 version',
          'sass?outputStyle=expanded&sourceMap'
        ]
      },
      {
        test: /.(png|gif|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};
