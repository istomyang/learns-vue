const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')

module.exports = merge(common, {
  // 调用webpack专门的优化
  mode: 'development',

  /**
   * 定位原始代码，还有其他选项
   * 1. 开发环境
   * 2. 特定场景
   * 3. 生产环境
   * https://www.webpackjs.com/configuration/devtool
   */
  devtool: 'inline-source-map',

  /**
   * 实时加载某个文件夹下的文件，作为服务器文件夹
   * npm命令纠正 "start:dev": "webpack serve"
   * https://github.com/webpack/webpack-dev-server#readme
   *
   * 其他选项：webpack-dev-middleware 配合 express 自定义更多需要
   * vue-elm 项目用的就是这个
   *
   * 配置 https://www.webpackjs.com/configuration/dev-server/
   */
  devServer: {
    // 提供内容，一般是静态文件
    contentBase: path.join(__dirname, 'dist'),
    // host: 'localhost',
    port: 9000,
    open: true,
    // 此路径下的打包文件可在浏览器中访问。
    publicPath: '/',
    // 模块热替换
    // 有个问题，对于没有dispose的事件处理，会在修改后依然有效。
    // 但有很多loader自带模块热替换的功能，使得make better
    hot: true,
    // stats: "verbose",
  },

  // 插件用于为webpaack赋能，必须打包优化、压缩
  plugins: [
    // 用于模块热替换的
    // new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),

    // 定义环境变量
    new webpack.DefinePlugin({
      // 给定的值必须包含引号，或者 '"production"'
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
})
