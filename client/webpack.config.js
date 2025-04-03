const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {

  entry: {
    'student' : path.resolve(__dirname, 'src/javascripts/student.js'), 
    'groups' : path.resolve(__dirname, 'src/javascripts/groups.js'),
  },
  mode : 'production',
  output: {
    path: path.resolve(__dirname, '../server/public'),
    filename: 'javascripts/[name].js'
  },

  module: {
    rules : [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.(png|jpg|gif)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name : '[name].[ext]',
              outputPath : 'images'
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "./index.html",
      chunks : ['index']
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/groups.html",
      filename: "html/groups.html",
      chunks : ['groups']
    }),
    new HtmlWebpackPlugin({
      template: "./src/html/student.html",
      filename: "html/student.html",
      chunks : ['student']
    }),
    new CopyPlugin({
  	    patterns: [
          {
            context: path.resolve(__dirname, "src", "images"),
            from: '**/*',
            to:   'images/[name][ext]',
            noErrorOnMissing: true
          },
          {
            context: path.resolve(__dirname, "src", "style"),
            from: '**/*',
            to:   'style/[name][ext]',
            noErrorOnMissing: true
          },
  	    ]
  	})
  ]
};
