import { Router } from "express";

import MiddlewareHandler from "../middleware/middleware-handler";
import CategoriesController from "../controller/categories-controller";
import CategoriesService from "../serviceLayer/categories-service";
import UsersService from "../serviceLayer/users-service";

export default class CategoriesApi {
    private router: Router;
    private categoriesController: CategoriesController;
    private middleware: MiddlewareHandler;

    constructor(private categoriesService: CategoriesService,private usersService: UsersService) {
        this.router = Router();
        this.categoriesController = new CategoriesController(this.categoriesService);
        this.middleware = new MiddlewareHandler();
        this.setRoutes();
    }
    private setRoutes() {
        this.router.post("/category", this.middleware.verifyToken, MiddlewareHandler.isAdmin(this.usersService),
        MiddlewareHandler.validateCategoryInput, this.categoriesController.createCategory.bind(this.categoriesController)); 
        this.router.post("/subcategory", this.middleware.verifyToken,MiddlewareHandler.isAdmin(this.usersService),
        MiddlewareHandler.validateSubCategoryInput, this.categoriesController.createSubCategory.bind(this.categoriesController));
        this.router.get("/categories", this.categoriesController.getAllCategoriesWithSubCategories.bind(this.categoriesController))
    }
    public getRouter() {
        return this.router;
    }
}