import { NextFunction, Request, Response } from "express";

import usersService from "../serviceLayer/users-service";

export default class UsersController {

    constructor(private usersService: usersService) {}

    async createUser(req: Request, res: Response,next: NextFunction): Promise<void> {
            try {
                const { id, name, phoneNumber ,password} = req.body;
    
                if (!id) {
                    res.status(400).json({ message: "נא לספק את פרטיך"});
                    return;
                }

                const userId = await this.usersService.createUser(id, name, phoneNumber,password);
                res.status(200).json({
                    success: true,
                    token: userId.token,
                    data: userId.user
                });
    
            }catch (error) {
                console.error("Caught error:", error);

                if (error instanceof Error && error.message === 'USER_ALREADY_EXISTS') {
                    res.status(400).json({ message: 'המשתמש כבר קיים במערכת!' });
                    return;
                }

                res.status(500).json({ message: 'שגיאת שרת פנימית' });
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
                next(error);//
            }
        }

    // async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    //     const id=req.params.id;

    //     if(!id){
    //         res.status(400).json({ message: "נא לספק את מזהה המשתמש" });
    //         return;
    //     }

    //     try {
    //         const user = await this.usersService.getUserById(id);
    //         res.status(200).json({  
    //             success: true,
    //             data: user
    //         });
    //     }catch(error){
    //         console.error("Error in getting user", error);
    //         res.status(500).json({ 
    //                 success: false, 
    //                 message: "תקלה בקבלת פרטי המשתמש"
    //             });
    //         next(error);
    //     }

    // }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id, password } = req.body;

        if (!id || !password) {
            res.status(400).json({ message: "נא לספק מספר זהות וסיסמה" });
            return;
        }

        const result = await this.usersService.login(id, password);
        
        res.status(200).json({
            success: true,
            message: "התחברת בהצלחה!",
            ...result
        });
    } catch (error: any) {
        res.status(401).json({ 
            success: false, 
            message: error.message 
        });
        next(error);
    }
}
}