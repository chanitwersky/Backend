import { NextFunction,Request,Response } from "express";
import CategoriesServise from "../serviceLayer/categories-service";


export default class categoriesController {
    constructor(private categoriesService: CategoriesServise) {}
    async createCategory(req: Request, res: Response,next: NextFunction): Promise<void> {
        try {
            const { id, name } = req.body;
            const category = await this.categoriesService.createCategory(id, name);
            res.status(201).json(category);
        } catch (error) {
            console.error("Error in create category:", error);
                res.status(500).json({ 
                    success: false, 
                    message: "תקלה ביצירת קטגוריה" 
                });
            next(error);
        }
    }

    async createSubCategory(req: Request, res: Response,next: NextFunction): Promise<void> {
        try {
            const { id, name , categoryId} = req.body;
            const category = await this.categoriesService.createSubCategory(id, name, categoryId);
            res.status(201).json(category);
        } catch (error) {
            console.error("Error in create sub category:", error);
                res.status(500).json({ 
                    success: false, 
                    message: "תקלה ביצירת תת קטגוריה" 
                });
            next(error);
        }
    }

    async getAllCategoriesWithSubCategories(req: Request, res: Response,next: NextFunction): Promise<void> {
        try{
            const allCatgories =await this.categoriesService.getAllCategoriesWithSubCategories();
            res.status(201).json(allCatgories);
        }catch (error) {
            console.error("Error in showing catgories:", error);
                res.status(500).json({ 
                    success: false, 
                    message: "תקלה בשליפת הקטגוריות" 
                });
            next(error);
        }
    }
}