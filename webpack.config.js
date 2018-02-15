const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
        {
          test: /\.(wav|mp3)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name]_[hash].[ext]'
              }
            }
          ]
        }
    ]
  },
  devServer: {
    contentBase: './dist'
  }

};
