"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCache = exports.MUser = exports.Neter = exports.Localer = exports.DataApi = void 0;
const net_1 = require("./net");
const mBase_1 = __importDefault(require("./mBase"));
const mUser_1 = require("./mUser");
const mCache_1 = require("./mCache");
const localer_1 = require("./localer");
const common_1 = require("@lv/shared/common");
const node_1 = require("@lv/shared/node");
const initDataApiSingleton = (() => {
    let flag = false;
    let status;
    let localer;
    let neter;
    let db;
    return async () => {
        let mStatus;
        try {
            if (!flag) {
                ;
                [localer, [db, mStatus], neter] = await common_1.runAsyncAll(localer_1.Localer.init(), mBase_1.default(), () => new net_1.Neter());
                flag = true;
            }
            const a = await node_1.isOnline();
            if (a)
                node_1.print('Net is work!', 3, 'Initialize');
            if (!a)
                process.exit(-1);
            if (a && mStatus)
                status = 'full';
            if (!mStatus)
                status = 'nodb';
            process.env.lv_data_mode = status;
            return [localer, db, neter, status];
        }
        catch (error) {
            throw error;
        }
    };
})();
class DataApi {
    static async init() {
        try {
            const da = new DataApi();
            let db;
            [da.localer, db, da.neter, da.mode] = await initDataApiSingleton();
            da.mUser = new mUser_1.MUser(db);
            da.mCache = new mCache_1.MCache(db);
            const mHasData = await da.mUser.checkHasData();
            if (!mHasData && da.localer.hasData) {
                await da.fileToDb();
            }
            node_1.print('Done: DataApi', 3, 'Initialize');
            return da;
        }
        catch (err) {
            throw err;
        }
    }
    async initUserData(username) {
        try {
            if (this.mode === 'full') {
                const UserAttach = (await this.mUser.collection.findOne({
                    username,
                }));
                await common_1.runAsyncAll(this.neter.injectUserProfile(UserAttach), this.neter.injectUserRepos(UserAttach));
                node_1.print('init data is OK', 3, 'initUserData');
                await common_1.runAsyncAll(this.mUser.collection.updateOne({ username }, {
                    $set: { profile: UserAttach.profile, repos: UserAttach.repos },
                }), (async () => {
                    this.localer.collection
                        .set(`${username}.profile`, UserAttach.profile)
                        .set(`${username}.repos`, UserAttach.repos)
                        .value();
                    await this.localer.saveToFile();
                })());
            }
        }
        catch (e) {
            throw e;
        }
    }
    async initUserDataTest(username) {
        try {
            const UserAttach = this.localer.collection
                .find({
                username,
            })
                .value();
            common_1.isEmpty(UserAttach.repos) || delete UserAttach.repos;
            await common_1.runAsyncAll(this.neter.injectUserRepos(UserAttach));
            node_1.print('init data is OK', 3, '[initUserData]');
            await common_1.runAsyncAll((async () => {
                this.localer.collection
                    .set(`${username}.repos`, UserAttach.repos)
                    .value();
                await this.localer.saveToFile();
            })());
        }
        catch (e) {
            throw e;
        }
    }
    static deId(rawObject) {
        return Object.values(rawObject).map(o => {
            o['_id'] && delete o['_id'];
            return o;
        });
    }
    async fileToDb() {
        const raw = this.localer.collection.value();
        try {
            await this.mUser.collection.insertMany(DataApi.deId(raw));
        }
        catch (e) {
            throw e;
        }
    }
}
exports.DataApi = DataApi;
var localer_2 = require("./localer");
Object.defineProperty(exports, "Localer", { enumerable: true, get: function () { return localer_2.Localer; } });
var net_2 = require("./net");
Object.defineProperty(exports, "Neter", { enumerable: true, get: function () { return net_2.Neter; } });
var mUser_2 = require("./mUser");
Object.defineProperty(exports, "MUser", { enumerable: true, get: function () { return mUser_2.MUser; } });
var mCache_2 = require("./mCache");
Object.defineProperty(exports, "MCache", { enumerable: true, get: function () { return mCache_2.MCache; } });
//# sourceMappingURL=index.js.map