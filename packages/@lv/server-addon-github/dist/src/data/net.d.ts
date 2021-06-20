import { RESTDataSource } from 'apollo-datasource-rest';
import { File, User } from '../types/user';
export declare class Neter extends RESTDataSource {
    constructor();
    injectUserProfile(attach: User): Promise<void>;
    injectUserRepos(attach: User): Promise<void>;
    getTreeLayer(uri: string): Promise<File[]>;
    getMarkDownHtml(uri: string): Promise<string>;
    getReadMe(fullname: string): Promise<string>;
    getFile(uri: string): Promise<string>;
}
