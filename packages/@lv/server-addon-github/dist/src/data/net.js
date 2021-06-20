"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neter = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const common_1 = require("@lv/shared/common");
const node_1 = require("@lv/shared/node");
class Neter extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.httpCache = new apollo_datasource_rest_1.HTTPCache();
        this.baseURL = 'https://api.github.com/';
    }
    async injectUserProfile(attach) {
        const getUserProfile = async (attach) => {
            const profile_fc = 'login,avatar_url,name,bio,location,email,html_url,public_repos,total_private_repos,followers,following';
            try {
                const token = attach.oauth.token;
                let __profile;
                if (token) {
                    __profile = await this.get('user', null, {
                        headers: {
                            Authorization: attach.oauth.token,
                            Accept: 'application/vnd.github.v3+json',
                        },
                    });
                }
                else {
                    __profile = await this.get(`users/${attach.username}`, null, {
                        headers: {
                            Accept: 'application/vnd.github.v3+json',
                        },
                    });
                }
                let _tmp = common_1.filterObject(__profile, profile_fc);
                common_1.injectFlags(_tmp, common_1.Flag.update);
                attach.profile = _tmp;
                __profile = null;
                _tmp = null;
            }
            catch (error) {
                throw error;
            }
        };
        const getUserProfileStars = async (attach) => {
            const username = attach.username;
            const star_fc = 'name,description,private,fork,fork_from,stargazers_count,language';
            try {
                let __stars = await this.get(`/users/${username}/starred`, null, {
                    headers: { Accept: 'application/vnd.github.v3+json' },
                });
                let _tmp_stars = [];
                for (let s of __stars) {
                    _tmp_stars.push(common_1.filterObject(s, star_fc));
                }
                attach.profile.stars = _tmp_stars;
                __stars = null;
                _tmp_stars = null;
            }
            catch (error) {
                throw error;
            }
        };
        try {
            await getUserProfile(attach);
            await getUserProfileStars(attach);
            node_1.print('profile data is ok!', 3, 'Initialize');
        }
        catch (error) {
            throw error;
        }
    }
    async injectUserRepos(attach) {
        let headers = { Accept: 'application/vnd.github.v3+json' };
        const username = attach.username;
        const token = attach.oauth.token || false;
        let path;
        if (token) {
            path = `/user/repos`;
            headers['Authorization'] = token;
        }
        else {
            path = `/users/${username}/repos`;
        }
        const filtercode = 'name,full_name,owner.login,private,fork,description,homepage,stargazers_count,watchers_count,language,forks_count,license.spdx_id,watchers_count';
        const schemaFigure = {
            login: 'owner.login',
            name: 'name',
            fullname: 'full_name',
            private: 'private',
            fork: 'fork',
            description: 'description',
            homepage: 'homepage',
            stargazers_count: 'stargazers_count',
            language: 'language',
            forks_count: 'forks_count',
            watchers_count: 'watchers_count',
            license: 'license.spdx_id',
        };
        const injectForkFrom = async (o) => {
            if (!o.fork)
                return;
            let path = o.fullname;
            const filtercode = 'parent.full_name';
            try {
                let r = await this.get(`/repos/${path}`, null, {
                    headers,
                });
                o.forked_from = common_1.filterObject(r, filtercode).parent
                    .full_name;
            }
            catch (e) {
                throw e;
            }
        };
        const injectBranchesInfo = async (o) => {
            const fullname = o.fullname;
            let branchpath = `/repos/${fullname}/branches`;
            try {
                let rawBranches = await this.get(branchpath, null, {
                    headers,
                });
                const branchfc = 'name,commit.sha';
                const schema = {
                    name: 'name',
                    uri: () => [
                        'commit.sha',
                        (sha) => `/repos/${fullname}/git/trees/${sha}`,
                    ],
                };
                o.branches = rawBranches.map(rawBranch => {
                    return common_1.pick(common_1.filterObject(rawBranch, branchfc), schema);
                });
                rawBranches = null;
            }
            catch (e) {
                throw e;
            }
        };
        const getReposNumber = async () => {
            const code1 = 'total_private_repos';
            const code2 = 'public_repos';
            let path;
            let headers = { Accept: 'application/vnd.github.v3+json' };
            if (token) {
                path = '/user';
                headers['Authorization'] = token;
            }
            else {
                path = `/users/${username}`;
            }
            try {
                const data = await this.get(path, null, { headers });
                const pri_n = parseInt(common_1.filterObject(data, code1)['total_private_repos']) || 0;
                const pub_n = parseInt(common_1.filterObject(data, code2)['public_repos']) || 0;
                return pri_n + pub_n;
            }
            catch (e) {
                throw e;
            }
        };
        try {
            const total = await getReposNumber();
            const per_page = 5;
            const page_count = Math.ceil(total / per_page);
            const launchArr = common_1.genArrayForAsync(1, page_count);
            let result = [];
            await common_1.runAsyncArray(launchArr, async (cursor) => {
                let rawRepos;
                try {
                    rawRepos = await this.get(path, { per_page, page: cursor }, { headers });
                }
                catch (e) {
                    throw e;
                }
                try {
                    await common_1.runAsyncArray(rawRepos, async (rawRepo) => {
                        let tmp = common_1.pick(common_1.filterObject(rawRepo, filtercode), schemaFigure);
                        await common_1.runAsyncAll(injectForkFrom(tmp), injectBranchesInfo(tmp));
                        common_1.injectFlags(tmp, common_1.Flag.update);
                        result.push(tmp);
                    });
                }
                catch (e) {
                    throw e;
                }
            });
            attach.repos = result;
            node_1.print('repos data is ok!', 3, 'Initialize');
        }
        catch (e) {
            throw e;
        }
    }
    async getTreeLayer(uri) {
        uri = common_1.deUrlPrefix(uri, 'repo');
        const fc = 'path,type,url';
        const schema = {
            name: 'path',
            type: 'type',
            uri: () => ['url', (url) => common_1.deUrlPrefix(url, 'repo')],
        };
        try {
            const { tree } = await this.get(uri, null, {
                headers: { Accept: 'application/vnd.github.v3+json' },
            });
            return tree.map(rawNode => {
                let r = common_1.pick(common_1.filterObject(rawNode, fc), schema);
                common_1.injectFlags(r, common_1.Flag.update);
                return r;
            });
        }
        catch (e) {
            throw e;
        }
    }
    async getMarkDownHtml(uri) {
        try {
            return await this.get(uri, null, {
                headers: { Accept: 'application/vnd.github.v3.html' },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getReadMe(fullname) {
        try {
            return await this.get(`/repos/${fullname}/readme`, null, {
                headers: { Accept: 'application/vnd.github.v3.html' },
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getFile(uri) {
        try {
            const raw = await this.get(uri, null, {
                headers: { Accept: 'application/vnd.github.v3.raw' },
            });
            return node_1.highlight(raw);
        }
        catch (e) {
            throw e;
        }
    }
}
exports.Neter = Neter;
//# sourceMappingURL=net.js.map