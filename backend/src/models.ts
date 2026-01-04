
import { Schema, model } from 'mongoose';



export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    password: string;
    role:"user" | "admin";
    
}

const UserSchema = new Schema<User>({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], required: false, default: "user" }
});

export interface Category {
    id: string;
    name: string;
}

const CategorySchema = new Schema<Category>({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true }
});

export interface Sub_category{
    id: string;
    name: string;
    categoryId: string;
}

const SubCategorySchema = new Schema<Sub_category>({
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    categoryId: { type: String, ref: 'Category', required: true } // אילוץ: חייב קטגוריה
});

export interface Prompt {
    id: string;
    userId: string;
    categoryId: string;
    subCategoryId: string;
    prompt: string;
    response: string;
    createdAt: Date;
}

const PromptSchema = new Schema<Prompt>({
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, ref: 'User', required: true },
    categoryId: { type: String, ref: 'Category', required: true },
    subCategoryId: { type: String, ref: 'Sub_category', required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const UserModel = model<User>('User', UserSchema);
export const CategoryModel = model<Category>('Category', CategorySchema);
export const SubCategoryModel = model<Sub_category>('Sub_category', SubCategorySchema);
export const PromptModel = model<Prompt >('Prompt', PromptSchema);