import { Router } from "express";

import PromptController from "../controller/prompts-controller";
import PromptsService from "../serviceLayer/prompts-service";
import MiddlewareHandler from "../middleware/middleware-handler";

export default class PromptsApi {
    private router: Router;
    private promptsController: PromptController;
    private middleware: MiddlewareHandler;

    constructor(private promptsService: PromptsService) {
        this.router = Router();
        this.promptsController = new PromptController(this.promptsService);
        this.middleware = new MiddlewareHandler();
        this.setRoutes();
    }
    private setRoutes() {
        this.router.post("/",this.middleware.verifyToken,      
        MiddlewareHandler.validatePromptInput, this.promptsController.createPrompt.bind(this.promptsController));
        this.router.get("/response",this.middleware.verifyToken,this.promptsController.getLastPrompt.bind(this.promptsController));
        this.router.get("/:userId",this.middleware.verifyToken,this.promptsController.getPromptsById.bind(this.promptsController));
        
        
    }

    public getRouter() {
        return this.router;
    } 
}

    