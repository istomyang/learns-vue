const common = {
  http_url: 'http://localhost',
  ws_url: 'ws://localhost',
}

// prefix: @lv_
const dev_env = {
  // main server
  main_port: 4000,

  // graphql
  graphql_uri: `${common.http_url}/graphql-github`,
  graphql_uri_sub: `${common.ws_url}/graphql-github/sub`,
}

export default () => {
	
}
