import { Db, MongoClient } from "mongodb";

const DB_URL = process.env.DB_URL || '';
const LEARNING_DB_NAME = "learning";

export default class DbConn {
    private connection!: MongoClient;

    constructor() { }

    async init() {
        this.connection = await MongoClient.connect(DB_URL);
    }

    getLearningDB(): Db {
        return this.connection.db(LEARNING_DB_NAME);
    }

    async terminate() {
        await this.connection.close();
    }
}