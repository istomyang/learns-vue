const webpack = require('webpack')
const {merge} = require('webpack-merge')
const common = require('./webpack.common')

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
  /**
   * 定位原始代码，还有其他选项
   * 1. 开发环境
   * 2. 特定场景
   * 3. 生产环境
   * https://www.webpackjs.com/configuration/devtool
   */
  devtool: 'source-map',

  // 调用webpack专门的优化
  mode: 'production',

  plugins: [
    // 代码压缩
    // 还有其他：BabelMinifyWebpackPlugin, ClosureCompilerPlugin
    // tree shaking 指南
    // new UglifyJSPlugin(),

    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
})
