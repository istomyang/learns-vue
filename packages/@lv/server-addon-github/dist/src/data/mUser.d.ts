import { Collection, Db } from 'mongodb';
import { LoginUserBasicInfo, User } from '../types/user';
export declare class MUser {
    collection: Collection<User>;
    constructor(db: Db);
    checkHasData(): Promise<boolean>;
    setNewLoginUser(data: User): Promise<void>;
    getNewLoginUser(): Promise<User>;
    setOauthUserToken(token: string): Promise<void>;
    hasUserInfo(data: User): Promise<boolean>;
    delUserInfo(username: string): Promise<void>;
    getAllUserBasicInfo(): Promise<LoginUserBasicInfo[]>;
}
