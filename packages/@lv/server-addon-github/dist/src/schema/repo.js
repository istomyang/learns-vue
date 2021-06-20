"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = exports.typeDef = void 0;
const apollo_server_koa_1 = require("apollo-server-koa");
const console_1 = require("console");
exports.typeDef = apollo_server_koa_1.gql `
  extend type Query {
    # one user's basic repos info
    Repos(username: String!): [RepoInfo!]

    # Init a branches tree
    InitBranch(uri: String): [JSONObject]

    # Get tree layer, called when click a folder
    GetTreeLayer(uri: String): [JSONObject]

    # Get repo readme
    GetReadMe(repoFullName: String!): JSON

    # Get file content, if markdown, has html
    GetFileContent(uri: String!, type: String): JSON
  }

  type RepoInfo {
    #vue
    name: String!
    #vuejs
    login: String!
    #vuejs/vue
    fullname: String!
    private: Boolean!
    fork: Boolean
    description: String
    homepage: String
    stargazers_count: Int
    language: String
    forks_count: String
    watchers_count: String
    license: String
    forked_from: String
    branches: [JSONObject]
  }
`;
exports.resolver = {
    Query: {
        async Repos(_, { username }, { dataApi }) {
            const api = dataApi;
            let result;
            try {
                if (api.mode === 'full') {
                    result = (await api.mUser.collection.findOne({ username }, {
                        projection: { repos: 1, _id: 0 },
                    })).repos;
                }
            }
            catch (e) {
                console_1.error(e);
            }
            return result;
        },
        async InitBranch(_, { uri }, { dataApi }) {
            const api = dataApi;
            try {
                return await api.neter.getTreeLayer(uri);
            }
            catch (e) {
                throw e;
            }
        },
        async GetTreeLayer(_, { uri }, { dataApi }) {
            const api = dataApi;
            try {
                return await api.neter.getTreeLayer(uri);
            }
            catch (e) {
                throw e;
            }
        },
        async GetReadMe(_, { repoFullName }, { dataApi }) {
            const api = dataApi;
            return await api.neter.getReadMe(repoFullName);
        },
        async GetFileContent(_, { uri, type }, { dataApi }) {
            const api = dataApi;
            let result = await dataApi.mCache.getCache(uri);
            if (!result) {
                const getF = /(markdown|md|Markdown)/.test(type)
                    ? api.neter.getMarkDownHtml
                    : api.neter.getFile;
                result = await getF(uri);
                api.mCache.setCache(uri, result).then();
            }
            return result;
        },
    },
};
//# sourceMappingURL=repo.js.map