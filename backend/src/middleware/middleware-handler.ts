import { Request, Response, NextFunction } from 'express';

import UsersService from '../serviceLayer/users-service';
import AuthUtils from '../utils/auth-utils';



export default class MiddlewareHandler {
    public static isAdmin(userService: UsersService) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const userId = (req as any).user.id;
                const user = await userService.getUserById(userId); 

                if (user && user.role === 'admin') {
                    return next();
                }
                res.status(403).json({ message: "גישה למנהלים בלבד" });
            } catch (error) {
                res.status(500).json({ message: "שגיאה בבדיקת הרשאות" });
            }
        };
    }

    public static validateNewUser(req: Request, res: Response, next: NextFunction) {
        const { name, phoneNumber, id } = req.body;

        if (!name || !phoneNumber || !id) {
            return res.status(400).json({ 
                success: false, 
                message: "כל השדות (שם, טלפון, מספר זיהוי) הם חובה" 
            });
        }

        
        const nameRegex = /^[a-zA-Zא-ת\s]{3,30}$/;
        if (!nameRegex.test(name)) {
            return res.status(400).json({ 
                success: false, 
                message: "שם לא תקין (חייב להכיל לפחות 3 אותיות ללא תווים מיוחדים)" 
            });
        }

        const phoneRegex = /^05\d{8}$|^0\d{8,9}$/;
        if (!phoneRegex.test(phoneNumber.replace(/-/g, ""))) { 
            return res.status(400).json({ 
                success: false, 
                message: "מספר טלפון לא תקין (צריך להיות בפורמט ישראלי)" 
            });
        }

        const idRegex = /^\d{9}$/; 

        if (!idRegex.test(id)) {
            return res.status(400).json({ 
            success: false, 
            message: "מספר זיהוי לא תקין - חייב להכיל בדיוק 9 ספרות" 
        });
        }

        next();
        }

    //לשנות את המפתח הסודי למשהו חזק יותר בסביבת הייצור
    private readonly JWT_SECRET = process.env.JWT_SECRET || '';

    public verifyToken = (req: any, res: Response, next: NextFunction) => {
        try {
           
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ 
                    success: false, 
                    message: "גישה נדחתה: חסר טוקן אימות" 
                });
            }
 
            const decoded = AuthUtils.verifyJwt(token);
            
            if (!decoded) {
                return res.status(403).json({ 
                    success: false, 
                    message: "טוקן לא תקין או פג תוקף" 
                });
            }
            req.user = decoded; 
            
            next();

        } catch (error) {
            console.error("JWT Verification Error:", error);
            return res.status(403).json({ 
                success: false, 
                message: "טוקן לא תקין או פג תוקף" 
            });
        }
    }

    public static validatePromptInput(req: Request, res: Response, next: NextFunction) {
        const { category, subCategory, promptText } = req.body;

        if (!category || !subCategory || !promptText) {
            return res.status(400).json({
                success: false,
                message: "חסרים נתונים: חובה לשלוח קטגוריה, תת-קטגוריה וטקסט"
            });
        }

        const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
        if (scriptRegex.test(promptText)) {
            return res.status(400).json({
                success: false,
                message: "הטקסט מכיל תווים לא חוקיים"
            });
        }

        next(); 
    }

   
    public static globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        
        console.error("Caught by Global Error Handler:", err);

        if (res.headersSent) {
            return next(err);
        }

        res.status(500).json({
            success: false,
            message: "התרחשה שגיאה בלתי צפויה במערכת, אנא נסה שוב מאוחר יותר"
        });
    }

    public static validateCategoryInput(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({
                message: "נא לשלוח שם קטגוריה תקין (categoryName)"
            });
        }

        const trimmed = name.trim();

        
        if (trimmed.length < 2 || trimmed.length > 25) {
            return res.status(400).json({
                message: "שם הקטגוריה חייב להיות בין 2 ל-25 תווים"
            });
        }

        req.body.categoryName = trimmed;
        next();
    }

    public static validateSubCategoryInput(req: Request, res: Response, next: NextFunction) {
        const { name, categoryId } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({
                message: "נא לשלוח שם תת-קטגוריה תקין"
            });
        }

        const trimmedSubName = name.trim();
        if (trimmedSubName.length < 2 || trimmedSubName.length > 40) {
            return res.status(400).json({
                message: "שם תת-הקטגוריה חייב להיות בין 2 ל-40 תווים"
            });
        }

        req.body.subCategoryName = trimmedSubName;
        
        next();
    }
}
