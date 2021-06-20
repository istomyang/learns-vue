import { Collection, Db } from 'mongodb';
import { Low } from '@lv/lowdb';
import { CollectionChain } from 'lodash';
interface CacheInfo {
    uri: string;
    time?: Date;
    content?: string;
}
export declare class Cache {
    dbCollection: Collection<CacheInfo>;
    localCollection: CollectionChain<CacheInfo>;
    db: Low;
    private readonly max;
    private cacheList;
    constructor(db: Db, max?: number);
    static init(db: Db, max?: number): Promise<Cache>;
    setCache(uri: string, content: string): Promise<void>;
    getCache(uri: string): Promise<string>;
    private runCleanIf;
    private saveToFile;
}
export {};
