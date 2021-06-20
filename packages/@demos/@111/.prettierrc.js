// “ https://prettier.io/docs/en/configuration.html

// vscode的插件读取这个文件，不会读取ESlint的配置文件
// prettier的eslint插件会读取 .prettierrc 文件或者 js json等，VScode需要重启。
// You can then set Prettier's own options inside a .prettierrc file. 1
// “1 https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: false,
  singleQuote: true,
  // if true, tabwidth failed
  useTabs: false,
  arrowParens: "avoid"
}
