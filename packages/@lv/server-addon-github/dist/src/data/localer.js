"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Localer = void 0;
const path_1 = require("path");
const lowdb_1 = require("@lv/lowdb");
const lodash_1 = require("lodash");
const fs_1 = require("fs");
const user_1 = require("../types/user");
class Localer {
    static async init() {
        const localer = new Localer();
        const file = path_1.join(__dirname, 'local.json');
        const adapter = new lowdb_1.JSONFile(file);
        localer.db = new lowdb_1.Low(adapter);
        try {
            await localer.db.read();
            console.log('local.json read:', localer.db.data);
        }
        catch (error) {
            localer.db.data = {};
        }
        localer.collection = lodash_1.chain(localer.db.data);
        localer.hasData = Object.keys(localer.collection.value()).length !== 0;
        return localer;
    }
    async saveToFile() {
        try {
            await this.db.write();
        }
        catch (error) {
            await fs_1.writeFile(path_1.join(__dirname, 'local.json'), JSON.stringify(this.db.data), { encoding: 'utf-8' }, () => { });
        }
    }
    async setNewLoginUser(data) {
        const username = data.username;
        const has = this.hasUserInfo(data);
        if (has) {
            this.collection.update(username, n => data).value();
        }
        else {
            this.collection.set(username, data).value();
        }
        await this.saveToFile();
    }
    async setOauthUserToken(token) {
        const username = this.collection.find({ status: user_1.UserStatus.oauth }).value()
            .username;
        this.collection
            .update(`${username}.oauth.token`, n => token)
            .update(`${username}.status`, n => user_1.UserStatus.login)
            .value();
        await this.saveToFile();
    }
    getUserInOauth() {
        return this.collection.find({ status: user_1.UserStatus.oauth }).value();
    }
    hasUserInfo(data) {
        const d = this.collection.has(data.username).value();
        if (!d) {
            return false;
        }
        const r1 = !!data.oauth.client_id;
        const r2 = this.collection.has(`${data.username}.oauth.client_id`).value();
        if (r1 && !r2)
            return false;
        if (!r1 && !r2)
            return true;
    }
    async delUserInfo(username) {
        this.collection.unset(username).value();
        await this.saveToFile();
    }
    getLoginUserInfo() {
        const mapping = user => ({
            name: user.profile.name,
            login: user.profile.login,
            avatar_url: user.profile.avatar_url,
            bio: user.profile.bio,
            location: user.profile.location,
            email: user.profile.email,
            html_url: user.profile.html_url,
        });
        return this.collection
            .filter({ status: user_1.UserStatus.login })
            .map(mapping)
            .value();
    }
}
exports.Localer = Localer;
//# sourceMappingURL=localer.js.map