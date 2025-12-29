import usersService from "../serviceLayer/users-service";
import { NextFunction, Request, Response } from "express";

export default class UsersController {

    constructor(private usersService: usersService) {}

    async createUser(req: Request, res: Response,next: NextFunction): Promise<void> {
            try {
                const { id, name, phoneNumber ,password,role} = req.body;
    
                if (!id) {
                    res.status(400).json({ message: "נא לספק את פרטיך"});
                    return;
                }

                const userId = await this.usersService.createUser(id, name, phoneNumber,password,role);
                res.status(200).json({
                    success: true,
                    token: userId.token,
                    data: userId.user
                });
    
            }catch (error) {
                console.error("Error in create User:", error);
                res.status(500).json({ 
                    success: false, 
                    message: "תקלה ביצירת המשתמש" 
                });
                next(error);
            }
        }

    async getAllUsersWithHistory(req: Request, res: Response, next: NextFunction):Promise<void>{
        try{
            const usersWithHistory=await this.usersService.getAllUsersWithHistory();    
            res.status(200).json({  
                success: true,
                data: usersWithHistory
            });
        }catch (error) {
            console.error("Error in getting users with history:", error);
            res.status(500).json({ 
                    success: false, 
                    message: "תקלה בהצגת משתמשים והיסטורית הלמידה שלהם" 
                });
            }
        }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id=req.params.userId;

        if(!id){
            res.status(400).json({ message: "נא לספק את מזהה המשתמש" });
            return;
        }

        try {
            const user = await this.usersService.getUserById(id);
            res.status(200).json({  
                success: true,
                data: user
            });
        }catch(error){
            console.error("Error in getting user", error);
            res.status(500).json({ 
                    success: false, 
                    message: "תקלה בקבלת פרטי המשתמש"
                });
            next(error);
        }

    }
}