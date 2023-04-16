const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fileLoader = require('file-loader');

module.exports = {
  target: "electron-renderer",
  entry: "./src/renderer.js",
  output: {
    path: __dirname + "/dist",
    publicPath: "./",
    filename: "bundle.js",
    libraryExport: "default",
  },
  devtool: 'source-map',
  mode: "development", // or "production"
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".aif"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.aif$/,
        loader: 'file-loader',
      },
      { 
        test: /\.tsx?$/, 
        loader: "ts-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};