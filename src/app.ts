import express, {Express} from "express";
import dotenv from 'dotenv';
import DbConn from "./utils/db-conn";

import UsersDal from "./dalLayer/users-dal";
import UsersService from "./serviceLayer/users-service";
import UsersApi from "./routes/users-api";
dotenv.config();
import PromptsService from "./serviceLayer/prompts-service";
import PromptsDal from "./dalLayer/prompts-dal"; 
import PromptsApi from "./routes/prompts-api";
import CategoriesDal from "./dalLayer/Categories-dal";
import MiddlewareHandler from "./middleware/middleware-handler";
import CategoriesService from "./serviceLayer/categories-service";
import CategoriesApi from "./routes/categories-api";

const HOST = "127.0.0.1";
const PORT = 5000;

export default class App {
    private app: Express;
    private dbConn: DbConn;

    constructor() {
        this.app = express();
        this.dbConn = new DbConn()
    }

    async init() {
        this.app.use(express.json());

        
        await this.dbConn.init();

        const usersDal = new UsersDal(this.dbConn);
        const usersService = new UsersService(usersDal);
        const userApi = new UsersApi(usersService);

        const categoriesDal = new CategoriesDal(this.dbConn);
        const categoriesService = new CategoriesService(categoriesDal);
        const categoriesApi = new CategoriesApi(categoriesService,usersService);

        const promptsDal = new PromptsDal(this.dbConn);
        const promptsService = new PromptsService(promptsDal, categoriesDal);
        const promptsApi = new PromptsApi(promptsService);

    
        this.setRoutes(userApi, promptsApi, categoriesApi);
}

    

    private setRoutes(userApi: UsersApi, promptsApi: PromptsApi, categoriesApi: CategoriesApi) {
    
    this.app.use("/api/users", userApi.getRouter());

    this.app.use("/api/prompts", promptsApi.getRouter());

    this.app.use("/api/categories", categoriesApi.getRouter());

    this.app.use(MiddlewareHandler.globalErrorHandler);

    this.app.listen(PORT, HOST, () => {
        console.log(`Listening on: http://${HOST}:${PORT}`);
    });
}
    
    async terminate() {
        if (this.dbConn) {
            await this.dbConn.terminate();
        }
    }

}