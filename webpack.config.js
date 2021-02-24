const WebpackPwaManifest = require("webpack-pwa-manifest");
const path = require("path");

const config = {
  entry: {
    index: "./public/index.js",
  },
  output: {
    path: __dirname + "/public/dist",
    filename: "[name].bundle.js",
  },
  mode: "production",
  plugins: [
    new WebpackPwaManifest({
      // the name of the generated manifest file
      filename: "manifest.json",
      // we aren't using webpack to generate our html so we
      // set inject to false
      inject: false,
      // set fingerprints to `false` to make the names of the generated
      // files predictable making it easier to refer to them in our code
      fingerprints: false,
      name: "PWA Offline Budgeter",
      short_name: "PWA Budget",
      theme_color: "#ffffff",
      background_color: "#ffffff",
      start_url: "/",
      publicPath: "/",
      display: "standalone",
      icons: [
        {
          src: path.resolve(__dirname, "public/icons/icon-512x512.png"),
          // the plugin will generate an image for each size
          // included in the size array
          size: [72, 96, 128, 152, 192, 384, 512],
          destination: path.join("assets", "icons"),
        },
      ],
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
