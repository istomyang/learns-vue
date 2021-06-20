import { PubSub } from 'apollo-server-koa';
export declare class MyPubSub extends PubSub {
    constructor();
}
export declare const channel: {
    TIMER: string;
    TOKEN: string;
    INIT: string;
};
