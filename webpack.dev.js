// const webpack = require("webpack");
const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
// const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },

  mode: "development",
  devServer: {
    host: "localhost",
    port: 3000,
    open: true,
    static: "./dist",
  },

  //   module: {
  //     rules: [
  //       {
  //         test: /\.s[ac]ss$/i,
  //         use: [
  //           // Creates `style` nodes from JS strings
  //           "style-loader",
  //           // Translates CSS into CommonJS
  //           "css-loader",
  //           // Compiles Sass to CSS
  //           "sass-loader",
  //         ],
  //       },
  //     ],
  //   },

  //   plugins: [
  //     new webpack.ProvidePlugin({
  //       $: "jquery",
  //       jQuery: "jquery",
  //     }),

  //     new HtmlWebpackPlugin({
  //       filename: "index.html",
  //       template: "./src/pages/home.html",
  //       chunks: ["app"],
  //     }),
  //     // new HtmlWebpackPlugin({
  //     //   filename: "somepage.html",
  //     //   somepage: "./src/somepage.html",
  //     //   chunks: ["app"],
  //     // }),
  //     // new HtmlWebpackPlugin({
  //     //   filename: "users.html",
  //     //   template: "./src/users.html",
  //     //   chunks: ["app"],
  //     // }),
  //   ],
});
