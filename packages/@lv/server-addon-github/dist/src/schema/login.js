"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = exports.typeDef = void 0;
const apollo_server_koa_1 = require("apollo-server-koa");
const console_1 = require("console");
const user_1 = require("../types/user");
const common_1 = require("@lv/shared/common");
const pubSub_1 = require("../pubSub");
exports.typeDef = apollo_server_koa_1.gql `
  extend type Query {
    # All login user, with simple info demanded
    allUserSimpleInfo: [UserSimpleInfo!]

    # One user with all profile info
    getProfileData(username: String): JSONObject
  }

  extend type Mutation {
    # Return URL to authorize
    login(username: String!, client_id: String, client_secret: String): String
    logout(username: String!): Boolean

    # init user data for viewer
    initData(username: String!): JSONObject
    initDataTest(username: String!): JSONObject
  }

  extend type Subscription {
    waitToken: Boolean
    waitInit: Boolean
  }

  type UserSimpleInfo {
    name: String!
    login: String!
    avatar_url: String!
    bio: String
    location: String
    email: String
    html_url: String
  }
`;
exports.resolver = {
    Query: {
        async allUserSimpleInfo(_, __, { dataApi }) {
            const api = dataApi;
            let result;
            try {
                if (api.mode === 'full') {
                    result = await api.mUser.getAllUserBasicInfo();
                }
            }
            catch (e) {
                console_1.error(e);
            }
            return result;
        },
        async getProfileData(_, { username }, { dataApi }) {
            const api = dataApi;
            let result;
            try {
                if (api.mode === 'full') {
                    result = (await api.mUser.collection.findOne({ username }, {
                        projection: { profile: 1, _id: 0 },
                    })).profile;
                }
            }
            catch (e) {
                console_1.error(e);
            }
            return result;
        },
    },
    Mutation: {
        login: async (_, { username, client_id, client_secret }, { dataApi, pubSub }) => {
            const api = dataApi;
            const sb = pubSub;
            const isGuest = !client_id;
            const data = {
                username,
                status: isGuest ? user_1.UserStatus.login : user_1.UserStatus.oauth,
                oauth: isGuest
                    ? { client_id: '', client_secret: '' }
                    : { client_id, client_secret },
            };
            try {
                if (api.mode === 'full') {
                    await common_1.runAsyncAll(api.mUser.setNewLoginUser(data), api.localer.setNewLoginUser(data));
                }
            }
            catch (e) {
                throw e;
            }
            const port = 4000;
            const scope = 'scope=repo%20repo:status%20public_repo%20gist%20notifications%20user%20read:user';
            if (!isGuest)
                sb.publish(pubSub_1.channel.TOKEN, { waitToken: false }).then();
            return isGuest
                ? ''
                : `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=http://localhost:${port}/authorize&state=istomyang&login=${username}&${scope}`;
        },
        logout: async (_, { username }, { dataApi }) => {
            const api = dataApi;
            try {
                if (api.mode === 'full') {
                    return await api.mUser.delUserInfo(username);
                }
            }
            catch (e) {
                throw e;
            }
            return true;
        },
        initData: async (_, { username }, { dataApi }) => {
            try {
                const api = dataApi;
                await api.initUserData(username);
                return api.localer.collection.find({ username }).value();
            }
            catch (e) {
                throw e;
            }
        },
        initDataTest: async (_, { username }, { dataApi }) => {
            try {
                const api = dataApi;
                await api.initUserDataTest(username);
                return api.localer.collection.find({ username }).value();
            }
            catch (e) {
                throw e;
            }
        },
    },
    Subscription: {
        waitToken: {
            subscribe: (_, __, { pubSub }) => {
                return pubSub.asyncIterator([pubSub_1.channel.TOKEN]);
            },
            waitInit(_, __, { pubSub }) {
                return pubSub.asyncIterator([pubSub_1.channel.INIT]);
            },
        },
    },
};
//# sourceMappingURL=login.js.map