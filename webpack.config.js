const WebpackPwaManifest = require("webpack-pwa-manifest");

const config = {
  entry: {
    index: "./assets/js/index.js",
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
  },
  mode: "development",
  plugins: [
    new WebpackPwaManifest({
      filename: "manifest.json",
      inject: false,
      name: "PWA Mini Project",
      short_name: "PWI MINI",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
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
module.exports = config;
