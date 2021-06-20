"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportSchema = void 0;
const apollo_server_koa_1 = require("apollo-server-koa");
const globby_1 = __importDefault(require("globby"));
const _1 = require("./");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/zh-cn.js");
const graphql_scalars_1 = require("graphql-scalars");
class Timer {
    constructor(pubSub) {
        this._timestamp = Date.now();
        this._pubSub = pubSub;
        moment_1.default.locale('zh-cn');
    }
    get time() {
        return moment_1.default(this._timestamp).toNow();
    }
    set time(timestamp) {
        this._timestamp = timestamp;
    }
    reset() {
        this._timestamp = Date.now();
    }
    heartbeat() {
        this._timeInterval = setInterval(Timer.publish, 10000, this._pubSub, this.time);
    }
    stop() {
        clearInterval(this._timeInterval);
    }
    static publish(pubSub, time) {
        pubSub.publish(_1.channel.TIMER, { timer: time }).then();
    }
}
const typeDefs = [
    apollo_server_koa_1.gql `
    enum ControlStatus {
      start
      reset
      pause
    }
  `,
    apollo_server_koa_1.gql `
    # 支持 YYYY-MM-DDThh:mm:ss.*sZ
    scalar DateTime
    # In src code, Object, number, and string can handle directly by JSON
    scalar JSON
    scalar JSONObject
  `,
    apollo_server_koa_1.gql `
    type Query {
      message: String!
      testDataTime: DateTime
      testJson: JSON
      testJsonObject: JSONObject
    }

    type Mutation {
      test(msg: String): JSONObject
      controlTimer(status: ControlStatus): JSONObject
    }

    type Subscription {
      timer: String
    }
  `,
];
const resolvers = [
    {
        Query: {
            message: (_, __) => 'Hey! Graphql.',
            testDataTime: () => new Date(),
            testJson: () => 'test json scalar!',
            testJsonObject: () => {
                return {
                    json: 'Json Object',
                };
            },
        },
        DateTime: graphql_scalars_1.DateTimeResolver,
        JSON: graphql_scalars_1.JSONResolver,
        JSONObject: graphql_scalars_1.JSONObjectResolver,
        Mutation: {
            test: (_, { msg }) => {
                return {
                    status: 'ok',
                    data: `Echo: ${msg}`,
                };
            },
            controlTimer: (_, { status }, { pubSub }) => {
                const timer = new Timer(pubSub);
                try {
                    switch (status) {
                        case 'start':
                            timer.heartbeat();
                            break;
                        case 'reset':
                            timer.reset();
                            timer.heartbeat();
                            break;
                        case 'pause':
                            timer.stop();
                            break;
                        default:
                            timer.stop();
                            break;
                    }
                    return { status: 'ok' };
                }
                catch (e) {
                    return {
                        status: 'fail',
                        message: e.message,
                    };
                }
            },
        },
        Subscription: {
            timer: {
                subscribe: (_, __, { pubSub }) => pubSub.asyncIterator([_1.channel.TIMER]),
            },
        },
    },
];
const findFiles = async (patterns) => await globby_1.default(patterns, {
    cwd: __dirname,
    absolute: true,
    onlyFiles: true,
});
const exportSchema = async () => {
    try {
        const files = await findFiles('./schema/**/*.ts');
        for (const path of files) {
            const { typeDef, resolver } = await Promise.resolve().then(() => __importStar(require(path)));
            typeDef && typeDefs.push(typeDef);
            resolver && resolvers.push(resolver);
        }
    }
    catch (error) {
        console.error(error);
    }
    return [typeDefs, resolvers];
};
exports.exportSchema = exportSchema;
//# sourceMappingURL=schema.js.map