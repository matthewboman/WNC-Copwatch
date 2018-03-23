const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './public/src/main.js',
  output: {
    path: path.resolve(__dirname, './public/dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'vue-style-loader', 'css-loader' ]
      },
      {
        test: /\.scss$/,
        use: [ 'vue-style-loader', 'css-loader', 'sass-loader' ]
      },
      {
        test: /\.sass$/,
        use: [ 'vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax' ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': [ 'vue-style-loader', 'css-loader', 'sass-loader' ],
            'sass': [ 'vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax' ]
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: { name: '[name].[ext]?[hash]' }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}
