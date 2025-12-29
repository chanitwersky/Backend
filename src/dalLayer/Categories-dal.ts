import { Collection } from "mongodb";

import DbConn from "../utils/db-conn.js";
import { Sub_category as SubCategoryModel } from "../models";
import { Category as CategoryModel } from "../models";

export default class CategoriesDal {
    private subCategoriesCollection: Collection<SubCategoryModel>;
    private categoriesCollection: Collection<CategoryModel>;
    constructor(dbConn: DbConn) {
        this.subCategoriesCollection = dbConn.getLearningDB().collection("sub_categories");
        this.categoriesCollection = dbConn.getLearningDB().collection("categories");
    }

    async getSubCategoryId(category: string): Promise<string> {
        const subCategory = await this.subCategoriesCollection.findOne({ name: category });
        if (!subCategory) {
            throw new Error(`Sub-category with name ${category} not found`);
        }
        return subCategory.id;
    }

    async getcategoryId(category: string): Promise<string> {
        const subCategory = await this.subCategoriesCollection.findOne({ name: category });
        if (!subCategory) {
            throw new Error(`Sub-category with name ${category} not found`);
        }
        return subCategory.categoryId;
    }

    async createCategory(category: CategoryModel): Promise<string> {
        const existingCategory = await this.categoriesCollection.findOne({ id: category.id });
        if (existingCategory) {
            throw new Error(`Category with id ${category.id} already exists`);
        }   

        await this.categoriesCollection.insertOne(category);
        return category.id;
    }

    async createSubCategory(subCategory: SubCategoryModel): Promise<string> {
        const existingSubCategory = await this.subCategoriesCollection.findOne({ id: subCategory.id });
        if (existingSubCategory) {
            throw new Error(`Sub-category with id ${subCategory.id} already exists`);
        }

        const existingCategory = await this.categoriesCollection.findOne({ id: subCategory.categoryId });
        if (!existingCategory) {
            throw new Error(`Category with id ${subCategory.categoryId} does not exist`);
        }
        

        await this.subCategoriesCollection.insertOne(subCategory);
        return subCategory.id;
    }

    async getAllCategoriesWithSubCategories(): Promise<Array<any>> {
        return await this.categoriesCollection.aggregate([
                {
                    $lookup: {
                        from: "Category",          
                        localField: "id",          
                        foreignField: "categoryId",    
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
        
            
}

    
