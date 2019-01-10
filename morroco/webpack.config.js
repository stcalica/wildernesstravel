var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "src/index.html"),
  filename: "./index.html"
});

module.exports = {
  entry: './src/App.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index.js'
  },
  plugins: [htmlWebpackPlugin]
};
