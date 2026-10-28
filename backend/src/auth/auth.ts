import jwt from "jsonwebtoken";

export class Auth{
    private access = process.env.ACCESS;
    private accessExp = process.env.ACCESS_EXP || "5m"; 
    private refresh = process.env.REFRESH;
    private refreshExp = process.env.REFRESH_EXP || "1d";
    private email = process.env.EMAIL;
    
	sign = (payload:string | object) => {
		try{
			return jwt.sign({ payload: payload }, this.access, { expiresIn: this.accessExp });
		}catch(err){
			throw err;
		}        
	};

	signRefresh = (payload:string | object) => {
		try{
			return jwt.sign({ payload: payload }, this.refresh, { expiresIn: this.refreshExp });
		}catch(err){
			throw err;
		}
	};

	signEmail = (payload:string | object, expiresIn:string | number) => {
		try{
			return jwt.sign({ payload: payload }, this.email, { expiresIn: expiresIn});
		}catch(err){
			throw err;
		}
	};

	verify = (token:string) => {
		try{
			return jwt.verify(token, this.access);
		}catch(err){
			throw err;
		}
	};
        
	verifyEmail = (token:string) => {
		try{
			return jwt.verify(token, this.email);
		}catch(err){
			throw err;
		}
	};

	verifyRefresh = (token:string) => {
		try{
			return jwt.verify(token, this.refresh);
		}catch(err){
			throw err;
		}
	};

	decode = (token:string) => {
		try{
			return jwt.decode(token);
		}catch(err){
			throw err;
		}
	};
}

export default new Auth();
