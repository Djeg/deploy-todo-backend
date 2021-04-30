const { MongoClient } = require('mongodb');

const client = new MongoClient(url);
let db = null;

export const db = async () => {
    if (!db) {
        db = await client.connect();
    }
}