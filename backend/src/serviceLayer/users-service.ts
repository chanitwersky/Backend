import bcrypt from 'bcrypt';

import UsersDal from "../dalLayer/users-dal";
import { User as UserModel } from "../models";
import AuthUtils from "../utils/auth-utils";


export default class UsersService {
    
    constructor(private usersDal: UsersDal) {}

    
    async createUser(id: string, name: string, phoneNumber: string,password:string):Promise<any>{

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await this.usersDal.getUserById(id);

        if (existingUser) {
            throw new Error('USER_ALREADY_EXISTS');
        }

        const user: UserModel = {
            id: id,
            name: name,
            phoneNumber: phoneNumber,
            password:hashedPassword,
            role: "user"
        };
        
        const newUser = await this.usersDal.createUser(user);
        const { password: _, ...safeUser } = newUser;
        
        const payload = { 
            id: id, 
            role: "user" 
        };

        const token = AuthUtils.signJwt(payload);
        return { user: safeUser, token };
    }

  

    async getAllUsersWithHistory():Promise<any[]>{
        return await this.usersDal.getAllUsersWithHistory();
    }

    async getUserById(id: string): Promise<UserModel | null> {  
        return await this.usersDal.getUserById(id);
    }

    async login(id: string, password: string): Promise<any> {
    
    const user = await this.usersDal.getUserById(id);
    
    if (!user) {
        throw new Error("משתמש לא קיים במערכת");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        throw new Error("סיסמה שגויה");
    }

    const payload = { id: user.id, role: user.role };
    const token = AuthUtils.signJwt(payload);

    return { 
        user: { id: user.id, name: user.name, role: user.role }, 
        token 
    };
}

}