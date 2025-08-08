const webpack = require("webpack");
const path = require("path");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 2000;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    open: true,
    port
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        //exclude: /node_modules/,
        exclude: /node_modules\/(?!(@esotericsoftware\/spine-phaser)\/).*/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false
                },
              ]
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties"
            ]
            // You can also place this configuration in a .babelrc or babel.config.js file
            // and remove the 'options' object here.
          },
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "assets", to: "assets" }]
    }),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ]
};
