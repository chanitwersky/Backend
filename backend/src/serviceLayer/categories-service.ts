import CategoriesDal from "../dalLayer/Categories-dal";
import { Category as CategoryModel } from "../models";
import { Sub_category as SubCategoryModel } from "../models";

export default class CategoriesServise{

    constructor(private categoriesDal:CategoriesDal){}

    async createCategory(name:string):Promise<string>{

        const id = String(Math.ceil(Math.random() * 100000));
        
        const category:CategoryModel={
            id:id,
            name:name
        };
        return await this.categoriesDal.createCategory(category);
    }

    async createSubCategory(name:string,categoryId:string):Promise<string>{

        const id = String(Math.ceil(Math.random() * 100000));
        const subCategory:SubCategoryModel={
            id:id,
            name:name,
            categoryId:categoryId
        };
        return await this.categoriesDal.createSubCategory(subCategory);
    }

    async getAllCategoriesWithSubCategories(): Promise<Array<any>> {
        return await this.categoriesDal.getAllCategoriesWithSubCategories();
    }
}