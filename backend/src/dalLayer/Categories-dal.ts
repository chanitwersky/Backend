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

    async getSubCategoryId(category: string): Promise<string | null> {
        const subCategory = await this.subCategoriesCollection.findOne({ name: category });
        if (!subCategory) {
            return null;
        }
        return subCategory.id;
    }

    async getcategoryId(category: string): Promise<string | null> {
        const cat = await this.categoriesCollection.findOne({ name: category });
        if (!cat) {
            return null;
        }
        return cat.id;
    }

    

    async getAllCategoriesWithSubCategories(): Promise<Array<any>> {
        return await this.categoriesCollection.aggregate([
            {
                $lookup: {
                    from: "sub_categories",
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

    async createCategory(category: CategoryModel): Promise<string> {

        await this.categoriesCollection.insertOne(category);
        return category.id;
    }

    async createSubCategory(sub_category: SubCategoryModel): Promise<string> {

        await this.subCategoriesCollection.insertOne(sub_category);
        return sub_category.id;
    }


}


