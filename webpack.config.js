const path = require("path");

module.exports = {
  //target: "electron-renderer",
  entry: "./renderer.js", // Path to your renderer.js file
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
  module: {
    rules: [
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