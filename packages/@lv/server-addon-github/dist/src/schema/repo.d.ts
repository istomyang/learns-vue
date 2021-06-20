import { Repo, File } from '../types/user';
export declare const typeDef: import("graphql").DocumentNode;
export declare const resolver: {
    Query: {
        Repos(_: any, { username }: {
            username: any;
        }, { dataApi }: {
            dataApi: any;
        }): Promise<Repo[]>;
        InitBranch(_: any, { uri }: {
            uri: any;
        }, { dataApi }: {
            dataApi: any;
        }): Promise<File[]>;
        GetTreeLayer(_: any, { uri }: {
            uri: any;
        }, { dataApi }: {
            dataApi: any;
        }): Promise<File[]>;
        GetReadMe(_: any, { repoFullName }: {
            repoFullName: any;
        }, { dataApi }: {
            dataApi: any;
        }): Promise<string>;
        GetFileContent(_: any, { uri, type }: {
            uri: any;
            type: any;
        }, { dataApi }: {
            dataApi: any;
        }): Promise<string>;
    };
};
