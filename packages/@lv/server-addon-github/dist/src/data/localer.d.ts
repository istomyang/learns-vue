import { Low } from '@lv/lowdb';
import { ObjectChain } from 'lodash';
import { Users, User, LoginUserBasicInfo } from '../types/user';
export declare class Localer {
    collection: ObjectChain<Users>;
    db: Low;
    hasData: boolean;
    static init(): Promise<Localer>;
    saveToFile(): Promise<void>;
    setNewLoginUser(data: User): Promise<void>;
    setOauthUserToken(token: string): Promise<void>;
    getUserInOauth(): User;
    hasUserInfo(data: User): boolean;
    delUserInfo(username: string): Promise<void>;
    getLoginUserInfo(): LoginUserBasicInfo[];
}
