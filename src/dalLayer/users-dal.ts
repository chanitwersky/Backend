import { Collection } from "mongodb";


import DbConn from "../utils/db-conn";
import { User as UserModel } from "../models";  

const USERS_COLLECTION_NAME="UserModel";

export default class usersDal {
    private usersCollection: Collection<UserModel>;
    constructor(dbConn: DbConn) {
        this.usersCollection = dbConn.getLearningDB().collection(USERS_COLLECTION_NAME);
    }

    async createUser(user: UserModel): Promise<string> {
        const existingUser = await this.usersCollection.findOne({ id: user.id });
        if (existingUser) {
            throw new Error(`User with id ${user.id} already exists`);
        }
        await this.usersCollection.insertOne(user);
        return user.id;
    }

    async getAllUsersWithHistory(): Promise<any[]> {
    return await this.usersCollection.aggregate([
        {
            $lookup: {
                from: "Prompt",          
                localField: "id",          
                foreignField: "userId",    
                as: "learningHistory"     
            }
        },
        {
            $project: {
                password: 0 
            }
        }
    ]).toArray();
    }

    async getUserById(id: string): Promise<UserModel | null> {
        return await this.usersCollection.findOne({ id: id });
    }
}