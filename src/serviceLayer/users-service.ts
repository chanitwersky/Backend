
import UsersDal from "../dalLayer/users-dal";
import { User as UserModel } from "../models";
import AuthUtils from "../utils/auth-utils";
import bcrypt from 'bcrypt';

export default class UsersService {
    
    constructor(private usersDal: UsersDal) {}

    


    async createUser(id: string, name: string, phoneNumber: string,password:string,role:"user" | "admin"):Promise<any>{

        const hashedPassword = await bcrypt.hash(password, 10);

        const user: UserModel = {
            id: id,
            name: name,
            phoneNumber: phoneNumber,
            password:hashedPassword,
            role: role
        };
        const newUser = await this.usersDal.createUser(user);

        const payload = { 
            id: id, 
            role: role 
        };

        const token = AuthUtils.signJwt(payload);
        return { user: newUser, token };
    }

  

    async getAllUsersWithHistory():Promise<any[]>{
        return await this.usersDal.getAllUsersWithHistory();
    }

    async getUserById(id: string): Promise<UserModel | null> {  
        return await this.usersDal.getUserById(id);
    }
}