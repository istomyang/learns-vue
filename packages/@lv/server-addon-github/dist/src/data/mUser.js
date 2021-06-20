"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUser = void 0;
const user_1 = require("../types/user");
class MUser {
    constructor(db) {
        this.collection = db.collection('github');
    }
    async checkHasData() {
        try {
            return !!(await this.collection.findOne({ status: user_1.UserStatus.login }));
        }
        catch (e) {
            throw e;
        }
    }
    async setNewLoginUser(data) {
        if (!(await this.hasUserInfo(data))) {
            try {
                await this.collection.insertOne(data);
            }
            catch (error) {
                throw error;
            }
        }
    }
    async getNewLoginUser() {
        try {
            return this.collection.findOne({ status: user_1.UserStatus.oauth });
        }
        catch (error) {
            throw error;
        }
    }
    async setOauthUserToken(token) {
        try {
            await this.collection.updateOne({ status: user_1.UserStatus.oauth }, {
                $set: { 'oauth.token': token, status: user_1.UserStatus.login },
            });
        }
        catch (e) {
            throw e;
        }
    }
    async hasUserInfo(data) {
        const d = await this.collection.findOne({ username: data.username });
        if (!d) {
            return false;
        }
        const r1 = data.oauth.client_id;
        const r2 = d.oauth.client_id;
        if (r1 && !r2) {
            await this.delUserInfo(data.username);
            return false;
        }
        if (!r1 && !r2)
            return true;
    }
    async delUserInfo(username) {
        try {
            await this.collection.deleteOne({ username: username });
        }
        catch (e) {
            throw e;
        }
    }
    async getAllUserBasicInfo() {
        try {
            const result = [];
            await this.collection
                .find({
                status: user_1.UserStatus.login,
            })
                .project({
                _id: 0,
                profile: {
                    name: 1,
                    login: 1,
                    avatar_url: 1,
                    bio: 1,
                    location: 1,
                    email: 1,
                    html_url: 1,
                },
            })
                .forEach(user => {
                result.push({
                    name: user.profile.name,
                    login: user.profile.login,
                    avatar_url: user.profile.avatar_url,
                    bio: user.profile.bio,
                    location: user.profile.location,
                    email: user.profile.email,
                    html_url: user.profile.html_url,
                });
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.MUser = MUser;
//# sourceMappingURL=mUser.js.map