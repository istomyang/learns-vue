import { User } from '../types/user';
export declare const typeDef: import("graphql").DocumentNode;
export declare const resolver: {
    Query: {
        allUserSimpleInfo(_: any, __: any, { dataApi }: {
            dataApi: any;
        }): Promise<any>;
        getProfileData(_: any, { username }: {
            username: any;
        }, { dataApi }: {
            dataApi: any;
        }): Promise<any>;
    };
    Mutation: {
        login: (_: any, { username, client_id, client_secret }: {
            username: any;
            client_id: any;
            client_secret: any;
        }, { dataApi, pubSub }: {
            dataApi: any;
            pubSub: any;
        }) => Promise<string>;
        logout: (_: any, { username }: {
            username: any;
        }, { dataApi }: {
            dataApi: any;
        }) => Promise<true | void>;
        initData: (_: any, { username }: {
            username: any;
        }, { dataApi }: {
            dataApi: any;
        }) => Promise<User>;
        initDataTest: (_: any, { username }: {
            username: any;
        }, { dataApi }: {
            dataApi: any;
        }) => Promise<User>;
    };
    Subscription: {
        waitToken: {
            subscribe: (_: any, __: any, { pubSub }: {
                pubSub: any;
            }) => AsyncIterator<unknown, any, undefined>;
            waitInit(_: any, __: any, { pubSub }: {
                pubSub: any;
            }): AsyncIterator<unknown, any, undefined>;
        };
    };
};
