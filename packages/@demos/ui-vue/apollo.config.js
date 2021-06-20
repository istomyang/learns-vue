module.exports = {
  client: {
    service: {
      name: 'demos-vue',
      // URL to the GraphQL API
      url: 'http://localhost:5000/gql',
    },
    // Files processed by the extension
    includes: ['src/**/*.vue', 'src/**/*.js'],
  },
}
