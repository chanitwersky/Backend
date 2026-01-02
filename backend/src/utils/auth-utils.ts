import jwt from "jsonwebtoken";

const code=process.env.JWT_SECRET || '';
export default class AuthUtils {
    static signJwt(payload:Object) {
         const token = jwt.sign(payload, code, { expiresIn: "1h" });
         return token;
    }
    static verifyJwt(token:string){
        try{
            const decoded = jwt.verify(token, code);
            return decoded;
        }catch(err){
            return null;
        }

    }
}           