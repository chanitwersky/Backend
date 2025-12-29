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
        await this.promptsCollection.insertOne(prompt);
        return prompt.response;
    }

    async getPromptsByUserId(userId: string): Promise<Array<PromptModel>> {
        return await this.promptsCollection.find({ userId: userId }).toArray();
    }

    

}