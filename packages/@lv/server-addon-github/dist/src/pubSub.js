"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = exports.MyPubSub = void 0;
const apollo_server_koa_1 = require("apollo-server-koa");
class MyPubSub extends apollo_server_koa_1.PubSub {
    constructor() {
        super();
        this.ee.setMaxListeners(Infinity);
    }
}
exports.MyPubSub = MyPubSub;
exports.channel = {
    TIMER: 'timer',
    TOKEN: 'token',
    INIT: 'initUser',
};
//# sourceMappingURL=pubSub.js.map