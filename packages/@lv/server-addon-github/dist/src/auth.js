"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const https_1 = require("https");
const common_1 = require("@lv/shared/common");
const console_1 = require("console");
class LoginApi {
    constructor(api) {
        this.api = api;
        this.mode = api.mode;
        this.localer = api.localer;
        this.mUser = api.mUser;
        this.neter = api.neter;
    }
    async getNewLoginUser() {
        if (this.mode === 'full') {
            return await this.mUser.getNewLoginUser();
        }
    }
    async setUserToken(token) {
        if (this.mode === 'full') {
            await common_1.runAsyncAll(this.mUser.setOauthUserToken(token), this.localer.setOauthUserToken(token));
        }
    }
}
exports.default = async (koa, api, pubSub) => {
    const loginApi = new LoginApi(api);
    koa.use(async (ctx, next) => {
        if (ctx.path === '/authorize') {
            const code = ctx.query['code'];
            const port = 4000;
            const d = await loginApi.getNewLoginUser();
            const client_id = d.oauth.client_id;
            const client_secret = d.oauth.client_secret;
            const username = d.username;
            const postData = JSON.stringify({
                client_id,
                client_secret,
                code,
                redirect_uri: `http://localhost:${port}/authorize`,
                state: 'istomyang',
            });
            const req = https_1.request('https://github.com/login/oauth/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, res => {
                res.setEncoding('utf-8');
                res.on('data', async (chunk) => {
                    const token = chunk.match(/(?<=access_token=)\w+(?=&)/g);
                    await loginApi.setUserToken(`token ${token}`);
                    console_1.log('OAuth is Get!: ', `token ${token}`);
                    pubSub.publish(_1.channel.TOKEN, { waitToken: true }).then();
                    loginApi.api.initUserData(username).then(() => {
                        pubSub.publish(_1.channel.INIT, { waitInit: true });
                    });
                });
            });
            req.on('error', err => console_1.error(err));
            req.write(postData);
            req.end();
        }
        await next();
    });
};
//# sourceMappingURL=auth.js.map