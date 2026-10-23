import jwt from "jsonwebtoken";

export class Auth{
    private expiry = process.env.JWT_EXPIRY || "5m"; 
    private secret = process.env.JWT_SECRET;
    private refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "1d";
    private refreshSecret = process.env.JWT_REFRESH_SECRET;
    private emailSecret = process.env.JWT_EMAIL_SECRET;
    
    sign = (payload:string | object) => {
        try{
            return jwt.sign({ payload: payload }, this.secret as any, { expiresIn: this.expiry });
        }catch(err){
            throw err;
        }        
    }

    signRefresh = (payload:string | object) => {
        try{
            return jwt.sign({ payload: payload }, this.refreshSecret, { expiresIn: this.refreshExpiry });
        }catch(err){
            throw err;
        }
    }

    signEmail = (payload:string | object, expiresIn:string | number) => {
        try{
            return jwt.sign({ payload: payload }, this.emailSecret, { expiresIn: expiresIn});
        }catch(err){
            throw err;
        }
    }
        
    verifyEmail = (token:string) => {
        try{
            return jwt.verify(token, this.emailSecret);
        }catch(err){
            throw err;
        }
    }

    verifyRefresh = (token:string) => {
        try{
            return jwt.verify(token, this.refreshSecret);
        }catch(err){
            throw err;
        }
    }
 
	verify = (token:string) => {
        try{
            return jwt.verify(token, this.secret);
        }catch(err){
            throw err;
        }
    }


    decode = (token:string) => {
        try{
            return jwt.decode(token);
        }catch(err){
            throw err;
        }
    }
}

export default new Auth();
