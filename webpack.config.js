const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const nodeSassMagicImporter = require('node-sass-magic-importer')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const env = process.env.NODE_ENV
const sourceMap = env === 'development'
const minify = env === 'production'

const config = {
  entry: ['./public/src/main.js'],
  mode: env,
  output: {
    // path: path.join(__dirname, 'public', 'dist'),
    // publicPath: '/public/dist/',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',

  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  devtool: sourceMap ? 'cheap-module-eval-source-map' : undefined,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    historyApiFallback: { disableDotRule: true }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: `vue-loader`,
      },
      {
        test: /\.js$/,
        loader: `babel-loader`,
        include: [path.join(__dirname, `public`)],
      },
      {
        test:/\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          `vue-style-loader`,
          {
            loader: `css-loader`,
            options: { sourceMap },
          },
          {
            loader: `sass-loader`,
            options: {
              importer: nodeSassMagicImporter(),
              sourceMap,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist', 'index.html'),
      template: path.join(__dirname, 'index.html'),
      inject: true,
      minify: minify ? {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotas: true
      } : false
    }),
  ],
}

if (minify) {
  config.optimization.minimizer = [
    new OptimizeCSSAssetsPlugin()
  ]
}

if (env !== 'development') {
  config.plugins.push(new MiniCssExtractPlugin())
  const sassLoader = config.module.rules.find(({test}) => test.test('.scss') ) // || test.test('.css')
  sassLoader.use[0] = MiniCssExtractPlugin.loader
}

module.exports = config
