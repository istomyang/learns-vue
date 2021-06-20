// node plugin https://github.com/mysticatea/eslint-plugin-node

// VScode的 Tabsize需要后期修改 是 space 还是 tab 键
// 设置 insert Spaces 设置为 flase

module.exports = {
  // 环境包括 语法和全局变量
  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    // "browser": true,
    // "es2021": true,
    node: true,
  },
  // 仅仅包括语法，比如ES6语法，不包括全局变量。
  // https://cn.eslint.org/docs/user-guide/configuring#specifying-parser-options
  parserOptions: {
    ecmaVersion: 12,
  },
  extends: [
    // 启用推荐的规则，但仍有一些，参 https://cn.eslint.org/docs/rules/
    'eslint:recommended',
    // 一些插件可能与prettier冲突，use "prettier/react"
    // " https://github.com/prettier/eslint-config-prettier/blob/main/README.md
    // " https://github.com/prettier/eslint-plugin-prettier
    'plugin:prettier/recommended',
  ],

  // 使用第三方插件 https://cn.eslint.org/docs/user-guide/configuring#configuring-plugins
  // 一般使用 extends，使用别人推荐配置，会顺便使用 plugins
  plugins: ['node'],
  rules: {
    // 禁止变量声明与外层作用域的变量同名
    // ESlint 一些未启用的规则
    'no-shadow': ['error'],

    // disallow require() expressions which import extraneous modules
    // " https://github.com/mysticatea/eslint-plugin-node#possible-errors
    'node/no-extraneous-require': [
      'error',
      {
        allowModules: [
          // "@vue/cli-service",
          // "@vue/cli-test-utils"
        ],
      },
    ],
  },
  // rules: {
  // 不建议，因为vscode插件无法读取。
  // 'prettier/prettier': [
  // 'error',
  // { singleQuote: true, tabWidth: 2, semi: false },
  //       { usePrettierrc: true },
  // ],
  // },
}
