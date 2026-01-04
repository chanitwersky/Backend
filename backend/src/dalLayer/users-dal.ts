import { Collection } from "mongodb";

import DbConn from "../utils/db-conn";
import { User as UserModel } from "../models";  

const USERS_COLLECTION_NAME="UserModel";

export default class usersDal {
    private usersCollection: Collection<UserModel>;

    constructor(dbConn: DbConn) {
        this.usersCollection = dbConn.getLearningDB().collection(USERS_COLLECTION_NAME);
    }

    async createUser(user: UserModel): Promise<UserModel> {
        const existingUser = await this.usersCollection.findOne({ id: user.id });
        if (existingUser) {
            throw new Error(`UserExists`);
        };

        await this.usersCollection.insertOne(user);
        return user;
    }


    async getAllUsersWithHistory(): Promise<any[]> {
    return await this.usersCollection.aggregate([

        {
        $lookup: {
            from: "PromptModel",
            localField: "id",
            foreignField: "userId",
            as: "learningHistory"
        }
        },

        {
        $unwind: {
            path: "$learningHistory",
            preserveNullAndEmptyArrays: true
        }
        },

        {
        $lookup: {
            from: "categories",
            localField: "learningHistory.categoryId",
            foreignField: "id",
            as: "categoryDetails"
        }
        },

        {
        $lookup: {
            from: "sub_categories",
            localField: "learningHistory.subCategoryId",
            foreignField: "id",
            as: "subCategoryDetails"
        }
        },

        {
        $addFields: {
            "learningHistory.categoryName": {
            $arrayElemAt: ["$categoryDetails.name", 0]
            },
            "learningHistory.subCategoryName": {
            $arrayElemAt: ["$subCategoryDetails.name", 0]
            }
        }
        },

        {
        $group: {
            _id: "$_id",
            id: { $first: "$id" },
            name: { $first: "$name" },
            phoneNumber: { $first: "$phoneNumber" },
            role: { $first: "$role" },
            learningHistory: { $push: "$learningHistory" }
        }
        },

        {
        $match: {
            learningHistory: {
            $elemMatch: { _id: { $exists: true } }
            }
        }
        },
        
        {
        $project: {
            password: 0,
            categoryDetails: 0,
            subCategoryDetails: 0
        }
        }

    ]).toArray();
    }


    async getUserById(id: string): Promise<UserModel | null> {
        return await this.usersCollection.findOne({ id: id });
    }

    // async getUserByPhoneNumber(phoneNumber: string): Promise<UserModel | null> {
    //     return await this.usersCollection.findOne({ phoneNumber: phoneNumber });
    // }


}