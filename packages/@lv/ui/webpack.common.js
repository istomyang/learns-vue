const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpack = require('webpack')

const iconpath =
  '../../../node_modules/material-design-icons/sprites/svg-sprite'

/**
 * Webpack缘起：
 * 对于开发：
 * + 处理JS版本问题，语言特性、环境变量，Babel和Polyfill
 * + 本地调试服务器、热重载、开发文件的维护（清理、命名）
 * + Webpack只认识ES5的JS，所以需要Loader识别其他资源
 * + 对资源来说，转换、压缩，这些需要插件
 * 对于生产：
 * + 下层技术限制：代码去重、精简、懒加载、分布请求
 *
 * > webpack github: https://github.com/webpack/webpack#install
 * > webpack offcial site: https://www.webpackjs.com/
 */

module.exports = {
  entry: {
    app: './src/index.js',
  },

  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  resolve: {
    // 自动扩展名
    extensions: ['.ts', '.js', '.vue'],
    // 别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        // https://vue-loader.vuejs.org/zh/guide/
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@kazupon/vue-i18n-loader',
      },
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        use: {
          // https://github.com/babel/babel-loader
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: [
              [
                /**
                 * Babel
                 * 语法转换、语言特性弥补 和 源码转换。
                 *
                 * Babel 内使用插件来指导代码如何进行转换，诸如
                 * `@babel/plugin-transform-arrow-functions`，但是一个一
                 * 个太多，所以需要预设，一组预先设定的插件，
                 * 比如 @babel/preset-env，而所谓配置，就是配置预设。
                 */
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage',
                  corejs: '3.9',
                  targets: {
                    edge: '17',
                    firefox: '60',
                    chrome: '67',
                    safari: '11.1',
                  },
                },
              ],
              // https://github.com/vuejs/jsx
              '@vue/babel-preset-jsx',
            ],
            plugins: [
              [
                // https://github.com/mAAdhaTTah/babel-plugin-prismjs
                'prismjs',
                {
                  languages: [
                    'javascript',
                    'stylus',
                    'html',
                    'css',
                    'typescript',
                    'svg',
                  ],
                  plugins: ['copy-to-clipboard', 'normalize-whitespace'],
                  theme: 'tomorrow',
                  css: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        // https://github.com/vuejs/vue-style-loader#readme
        use: [
          // implement from 'style-loader'
          'vue-style-loader',
          {
            // https://github.com/webpack-contrib/css-loader
            loader: 'css-loader',
            options: {
              // 可在某个组件使用CSS Module
              // 关闭CSS module模式
              modules: false,
              esModule: false,
            },
          },
        ],
      },
      {
        // 若没有该文件，忽略
        // https://github.com/webpack-contrib/sass-loader
        test: /\.s(c|a)ss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // 有node和dart
              implementation: require('sass'),

              sassOptions: {
                indentedSyntax: true,
                indentWidth: 2,
                // 共享全局变量，或来自文件
                additionalData: `$color: red;`,
                additionalData: `./constant.scss`,
              },
            },
          },
        ],
      },
      {
        test: /\.styl(us)?$/,
        // 传递顺序是逆向
        use: [
          'vue-style-loader',
          {
            // https://github.com/webpack-contrib/css-loader
            loader: 'css-loader',
            options: {
              // 可在某个组件使用CSS Module
              // 关闭CSS module模式
              modules: false,
              esModule: false,
            },
          },
          {
            // https://github.com/webpack-contrib/stylus-loader
            loader: 'stylus-loader',
            options: {
              stylusOptions: {
                // 才能把此导入全局
                import: [path.join(__dirname, 'src/style/imports.styl')],
              },
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            // 如果有url-loader则不需要file-loader，否则会冲突
            // https://github.com/webpack-contrib/url-loader
            loader: 'url-loader',
            options: {
              limit: 819,
              // 否则出现图片地址 [Object Module]
              esModule: false,
              // 超过limit的代替，默认'file-loader'
              // 可用来设置文件
              // responsive-loader 更强：
              // https://github.com/dazuaz/responsive-loader
              fallback: require.resolve('responsive-loader'),
              // The fallback loader will receive the same configuration
              // options as url-loader.
              name: '[hash]-[width].[ext]',
              // ??? dev下无法加载图片
              // outputPath: path.resolve(__dirname, '/images/'),
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            // https://github.com/webpack-contrib/file-loader
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              esModule: false,
            },
          },
        ],
        exclude: path.resolve(__dirname, iconpath),
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-inline-loader',
          },
        ],
        include: path.resolve(__dirname, iconpath),
      },
      {
        test: /\.(graphql|gql)$/,
        loader: 'graphql-tag/loader',
      },
    ],
  },

  // 插件用于为webpaack赋能，必须打包优化、压缩
  plugins: [
    // 也必须引入插件
    // 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块
    new VueLoaderPlugin(),

    /**
     * 每次构建之前清理
     * 选项包含其他一些功能
     * https://github.com/johnagan/clean-webpack-plugin
     */
    new CleanWebpackPlugin({
      // 输出日志
      verbose: true,
    }),

    /**
     * 生成HTML文件
     * 选项包含很多生成HTML文件的功能，甚至包含模板功能。
     * 高级功能：https://github.com/jaketrent/html-webpack-template
     * https://github.com/jantimon/html-webpack-plugin
     */
    new HtmlWebpackPlugin({
      // 标题
      title: 'ls-vues',
      // 文件名称
      // {String|Function}
      filename: () => 'index.html',
      // 指定的模板路径
      template: 'index.html',
      // 图标
      favicon: 'favicon.ico',
    }),
  ],
}
