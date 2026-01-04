import { Collection } from "mongodb";

import DbConn from "../utils/db-conn";
import { Prompt as PromptModel } from "../models";

const PROMPTS_COLLECTION_NAME = "PromptModel";

export default class promptsDal {
    private promptsCollection: Collection<PromptModel>;

    constructor(dbConn: DbConn) {
        this.promptsCollection = dbConn.getLearningDB().collection(PROMPTS_COLLECTION_NAME);
    }

    async createPrompt(prompt: PromptModel): Promise<string> {
        try {
            const result = await this.promptsCollection.insertOne(prompt);
            console.log("Insert result:", result); 
            return prompt.response;
        } catch (error) {
            console.error("שגיאה בשמירה ל-DB:", error);
            throw error; 
    }
    }

    async getPromptsByUserId(userId: string): Promise<Array<PromptModel>> {
        return await this.promptsCollection.find({ userId: userId }).toArray();
    }

    async getLastPrompt(userId: string): Promise<string> {
        const results = await this.promptsCollection
            .find({ userId: userId })
            .sort({ _id: -1 })
            .limit(1) 
            .project({ response: 1, _id: 0 })         
            .toArray();

        return results[0].response
    }

    

}