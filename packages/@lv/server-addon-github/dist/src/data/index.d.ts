import { Neter } from './net';
import { MUser } from './mUser';
import { MCache } from './mCache';
import { Localer } from './localer';
export declare class DataApi {
    mUser: MUser;
    mCache: MCache;
    localer: Localer;
    neter: Neter;
    mode: string;
    static init(): Promise<DataApi>;
    initUserData(username: string): Promise<void>;
    initUserDataTest(username: string): Promise<void>;
    private static deId;
    fileToDb(): Promise<void>;
}
export { Localer } from './localer';
export { Neter } from './net';
export { MUser } from './mUser';
export { MCache } from './mCache';
