import 'moment/locale/zh-cn.js';
export declare const exportSchema: () => Promise<(import("graphql").DocumentNode[] | {
    Query: {
        message: (_: any, __: any) => string;
        testDataTime: () => Date;
        testJson: () => string;
        testJsonObject: () => {
            json: string;
        };
    };
    DateTime: import("graphql").GraphQLScalarType;
    JSON: import("graphql").GraphQLScalarType;
    JSONObject: import("graphql").GraphQLScalarType;
    Mutation: {
        test: (_: any, { msg }: {
            msg: any;
        }) => {
            status: string;
            data: string;
        };
        controlTimer: (_: any, { status }: {
            status: any;
        }, { pubSub }: {
            pubSub: any;
        }) => {
            status: string;
            message?: undefined;
        } | {
            status: string;
            message: any;
        };
    };
    Subscription: {
        timer: {
            subscribe: (_: any, __: any, { pubSub }: {
                pubSub: any;
            }) => AsyncIterator<unknown, any, undefined>;
        };
    };
}[])[]>;
