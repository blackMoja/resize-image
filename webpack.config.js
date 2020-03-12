const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

console.log(`env : ${process.env.NODE_ENV}`);

module.exports = {
  entry: process.env.NODE_ENV === 'production' ? './src/js/resize-image.js' : './src/js/tc-event.js',
  output: {
    path: path.resolve(__dirname, 'resize'),
    filename: 'index.js'
  },
  devServer: {
    contentBase: path.resolve('./resize'),
    index: 'index.html',
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'src/js')
        ],
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  },
  plugins: process.env.NODE_ENV === 'production' ? [new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['resize'] })] : [new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['resize'] }), new HtmlWebPackPlugin({ template: './src/index.html', filename: 'index.html' })],
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'source-map',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
};