import { NextFunction, Request, Response } from 'express';

import promptsService from '../serviceLayer/prompts-service';

 

export default class PromptController {
    
    constructor(private promptsService: promptsService) {}

   
    async createPrompt(req: any, res: Response, next: NextFunction): Promise<void> {
    try { 
        console.log("--- DEBUG START ---");
        console.log("Full User Object from Token:", req.user);
        console.log("Body received:", req.body);
        
        
        const userId = req.user?.id || req.user?._id; 
        console.log("Extracted userId:", userId);
        
        const { category, subCategory, promptText } = req.body;

        if (!userId) {
             console.error("DEBUG: No userId found in req.user!");
             res.status(401).json({ success: false, message: "משתמש לא מזוהה" });
             return;
        }

        const lesson = await this.promptsService.createPrompt(userId, category, subCategory, promptText);
        
        res.status(200).json({
            success: true,
            data: lesson
        });

    } catch (error: any) {
        console.error("Error in createPrompt:", error);
        res.status(500).json({ 
            success: false, 
            message: "תקלה ביצירת השיעור" 
        });
        next(error);
    }
}

    async getLastPrompt(req: any, res: Response,next: NextFunction):Promise<void>{
        try{
            const userId = req.user.id; 

            const response=await this.promptsService.getLastPrompt(userId);
            
            res.status(200).json({
                success: true,
                data: response
            });

            }catch (error) {
            console.error("error by ai response:", error);
            res.status(500).json({ 
                success: false, 
                message: "תקלה ביצירת שיעור" 
            });
            next(error);
            
        }
    }


    async getPromptsById(req: any, res: Response,next: NextFunction):Promise<void>{
        try{
            const id= req.params.userId;
            const loggedInUserId = req.user.id;

            if (id !== loggedInUserId) {
                res.status(403).json({ 
                    success: false, 
                    message:"איך לך הרשאה לגשת להיסטוריה של משתמש אחר"
                });
                return;
            }
            const prompts=await this.promptsService.getPromptsById(id);
            
            res.status(200).json({
                success: true,
                data: prompts
            });

            }catch (error) {
            console.error("Error in showing history:", error);
            res.status(500).json({ 
                success: false, 
                message: "תקלה בקבלת ההיסטוריה" 
            });
            next(error);
            
        }
    }

}


