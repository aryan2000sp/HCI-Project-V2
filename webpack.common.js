const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: { app: "./src/index.js" },
  // output: {
  //   filename: "index.[contenthash].js",
  //   path: path.resolve(__dirname, "dist"),
  // },

  // mode: "production",

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },

      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(svg|png|jpeg|gif)$/,
        type: "asset/resource",
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      // jQuery: "jquery",
      Popper: ["popper.js", "default"],
      "window.jQuery": "jquery",
    }),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "./src/pages/home.html",
      chunks: ["app"],
    }),

    new HtmlWebpackPlugin({
      filename: "food_diary.html",
      template: "./src/pages/food_diary.html",
      chunks: ["app"],
    }),

    new HtmlWebpackPlugin({
      filename: "search_food.html",
      template: "./src/pages/search_food.html",
      chunks: ["app"],
    }),

    new HtmlWebpackPlugin({
      filename: "summary.html",
      template: "./src/pages/summary.html",
      chunks: ["app"],
    }),

    new HtmlWebpackPlugin({
      filename: "profile.html",
      template: "./src/pages/profile.html",
      chunks: ["app"],
    }),

    new HtmlWebpackPlugin({
      filename: "simulate.html",
      template: "./src/pages/simulate.html",
      chunks: ["app"],
    }),
  ],
};
