"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const common_1 = require("@lv/shared/common");
const path_1 = require("path");
const lowdb_1 = require("@lv/lowdb");
const lodash_1 = require("lodash");
const fs_1 = require("fs");
class Cache {
    constructor(db, max = 1000) {
        this.dbCollection = db.collection('github-cache');
        this.max = max;
    }
    static async init(db, max = 1000) {
        const cache = new Cache(db, max);
        cache.db = new lowdb_1.Low(new lowdb_1.JSONFile(path_1.join(__dirname, 'cache.json')));
        try {
            await cache.db.read();
        }
        catch (error) {
            cache.db.data = [];
        }
        cache.localCollection = lodash_1.chain(cache.db.data);
        return cache;
    }
    async setCache(uri, content) {
        try {
            this.localCollection.push({
                uri,
                content,
            });
            await common_1.runAsyncAll(this.dbCollection.insertOne({
                uri,
                content,
            }), this.saveToFile());
            this.cacheList.push({ uri, time: common_1.Timer.getUpdate() });
            await this.runCleanIf();
        }
        catch (e) {
            throw e;
        }
    }
    async getCache(uri) {
        const query = this.cacheList.find(item => item.uri === uri);
        if (!query)
            return null;
        query.time = common_1.Timer.getUpdate();
        const result = await this.dbCollection.findOne({ uri });
        return result.content;
    }
    async runCleanIf() {
        const many = this.cacheList.length - this.max;
        if (many < 1)
            return;
        const l = [];
        this.cacheList.forEach(item => {
            l.push(item.time);
        });
        common_1.Timer.sort(l);
        const time = l[many];
        const delList = [];
        const preserve = [];
        this.cacheList.forEach(item => {
            if (common_1.Timer.athanb(item.time, time) === -1) {
                delList.push(item.uri);
            }
            else {
                preserve.push(item);
            }
        });
        this.cacheList = preserve;
        this.localCollection.pullAllBy(delList, 'uri');
        try {
            await common_1.runAsyncAll(this.dbCollection.deleteMany({ uri: { $in: delList } }), this.saveToFile());
        }
        catch (e) {
            throw e;
        }
    }
    async saveToFile() {
        try {
            await this.db.write();
        }
        catch (error) {
            await fs_1.writeFile(path_1.join(__dirname, 'cache.json'), JSON.stringify(this.db.data), { encoding: 'utf-8' }, () => { });
        }
    }
}
exports.Cache = Cache;
//# sourceMappingURL=mCache.js.map