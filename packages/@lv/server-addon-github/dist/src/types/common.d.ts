import { User } from './user';
export declare enum Status {
    success = 0,
    faild = 1,
    has = 2
}
export interface Result {
    status: Status;
    data?: string | any[] | any;
    message?: string;
}
export declare type NetResult = {
    _b: boolean;
    error?: any;
};
export interface IDataClass {
    setNewLoginUser(data: User): any;
    getNewLoginUser(): Promise<User>;
    setOauthUserToken(token: string): any;
}
