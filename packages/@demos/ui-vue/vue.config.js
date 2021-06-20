// https://cli.vuejs.org/zh/
module.exports = {
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('graphql')
      .test(/\.(graphql|gql)$/)
      .use('graphql-tag/loader')
      .loader('graphql-tag/loader')
      .end()
      .rule('sass')
      .test(/\.s(c|a)ss$/)
      .use('vue-style-loader')
      .loader('vue-style-loader')
      .loader('css-loader')
      .loader('sass')
      .loader('sass-loader')
      .options({
        // 有node和dart
        implementation: require('sass'),

        sassOptions: {
          indentedSyntax: true,
          indentWidth: 2,
        },
      })
      .end()
  },
}
