export declare type Users = {
    [username: string]: User;
};
export declare type User = {
    username: string;
    status: UserStatus;
    oauth?: OAuth;
    profile?: Profile;
    repos?: Repo[];
};
export interface LoginUserBasicInfo {
    name: string;
    login: string;
    avatar_url: string;
    bio?: string;
    location?: string;
    email?: string;
    html_url: string;
}
export declare enum UserStatus {
    oauth = "oauth",
    login = "login"
}
export interface OAuth {
    client_id: string;
    client_secret: string;
    token?: string;
}
export interface Profile {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    location: string;
    email: string;
    html_url: string;
    public_repos: Number;
    total_private_repos: Number;
    followers: Number;
    following: Number;
    update_time?: string;
    stars?: StarredRepoInfo[];
}
export interface StarredRepoInfo {
    name: string;
    description?: string;
    private?: Boolean;
    fork?: Boolean;
    fork_from?: string;
    stargazers_count?: Number;
    language?: string;
}
export interface Repo {
    login: string;
    name: string;
    fullname: string;
    private: boolean;
    fork: boolean;
    description: string;
    homepage: string;
    stargazers_count: number;
    language: string;
    forks_count: string;
    watchers_count: string;
    license: string;
    update_time?: string;
    forked_from?: string;
    branches: Branch[];
}
export interface Branch {
    name: string;
    uri: string;
    node?: File[];
}
export interface RawNode {
    name: string;
    uri: string;
}
export interface File extends RawNode {
    node?: File[] | boolean;
    update_time?: string;
}
