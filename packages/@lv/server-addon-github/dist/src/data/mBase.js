"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCollection = void 0;
const mongodb_1 = require("mongodb");
const node_1 = require("@lv/shared/node");
const uri = 'mongodb://127.0.0.1:27017';
exports.default = async () => {
    let status;
    let db;
    const client = new mongodb_1.MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    try {
        await client.connect();
        status = true;
        db = client.db('lv');
    }
    catch (error) {
        status = false;
        await client.close();
    }
    if (status) {
        node_1.print('MongoDb is run!', 3, 'Initialize');
    }
    else {
        node_1.print('MongoDb does not work!', 1, 'Initialize');
    }
    return [db, status];
};
const hasCollection = async (db, collectionName) => {
    (await db.collections()).some(collection => {
        collection.collectionName === ;
        collectionName;
    });
};
exports.hasCollection = hasCollection;
//# sourceMappingURL=mBase.js.map