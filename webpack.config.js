const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fileLoader = require('file-loader');

module.exports = {
  target: "electron-renderer",
  entry: "./renderer.js", // Path to your renderer.js file
  //watch: true,
  output: {
    path: __dirname + "/dist",
    publicPath: "./",
    filename: "bundle.js",
    // The following two lines are necessary for Electron to load the bundle correctly
    //libraryTarget: "commonjs2",
    libraryExport: "default",
  },
  devtool: 'source-map',
  mode: "development", // or "production"
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".aif"],
  },
  devServer: {
    static: './dist/',
    hot: true,
    port: 8080
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
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