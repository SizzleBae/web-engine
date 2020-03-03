const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    editor: './src/views/editor/editor.ts',
    viewer: './src/views/viewer/viewer.ts',
  },

  output: {
    filename: '[name].js',
    path: __dirname + '/server/views/'
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [{ test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ }],
  },

  devServer: {
    open: true
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin(),
  ]
};
