import { Router } from "express";

import usersService from "../serviceLayer/users-service";
import userController from "../controller/users-controller";
import MiddlewareHandler from "../middleware/middleware-handler";




export default class UsersApi {
    private router: Router;
    private usersController: userController;
    private middleware: MiddlewareHandler;

    constructor(private usersService: usersService) {
        this.router = Router();
        this.usersController = new userController(this.usersService);
        this.middleware = new MiddlewareHandler();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.post("/", MiddlewareHandler.validateNewUser, this.usersController.createUser.bind(this.usersController));
        this.router.get("/history",this.middleware.verifyToken, MiddlewareHandler.isAdmin(this.usersService), 
        this.usersController.getAllUsersWithHistory.bind(this.usersController));
        this.router.post("/login", this.usersController.login.bind(this.usersController));

    }

    public getRouter() {
        return this.router;
    } 
    
}



