import { Db } from 'mongodb';
declare const _default: () => Promise<(boolean | Db)[]>;
export default _default;
export declare const hasCollection: (db: Db, collectionName: string) => Promise<boolean>;
