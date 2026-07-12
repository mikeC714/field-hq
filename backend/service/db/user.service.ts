import bcrypt from "bcrypt";
import { AppError, AuthenticationError } from "../../error/error.handler.js";
import { encrypt } from "../../utils/encrypt.js";
import type User from "../../types/user.d.ts";

export class UserService{
	constructor(private db:any){
		this.db = db;
	}
	async storeNewUser(user:User):Promise<object>{
		const { first_name, last_name, email, password } = user;
        if(!first_name || !last_name || !email || !password) throw new AppError("Missing field. Please try again.", 400);
        try{
            const results = await this.db.query(
                "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email",
                [first_name, last_name, email, password]
            );
            
            return results.rows[0]; 
        }catch(err:any){
			if(err.code === "23505") throw new AuthenticationError("Invalid credentials", 409);
            throw err;
        }
    }
    async getUser(email:User['email']):Promise<object>{
        if(!email) throw new AppError("Invalid credentials.", 400);
        try{
            const results = await this.db.query(
                `SELECT 
                    id, 
                    first_name, 
                    last_name, 
                    email, 
                    password 
                FROM users WHERE email = $1`,
                [email]
            )
			return results.rows[0];
        }catch(err){
        	throw err;
		}
    }
    async getUserById(user_id:User["user_id"]):Promise<object>{
        if(!user_id) throw new AppError("User not found.", 404);
        try{
            const results = await this.db.query(
                "SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1",
                [user_id]
            );
			return results.rows[0];
        }catch(err){
            throw err;
        }
    }
    async deleteUser(user_id:User["user_id"]):Promise<void>{
        if(!user_id) throw new AppError("User not found.", 404);
        try{
            await this.db.query(
                `DELETE FROM users WHERE id = $1`,
                [user_id]
            );
        }catch(err){
            throw err;
        }
    }
    async flagUser(user_id:User["user_id"]){
        if(!user_id) throw new AppError("User not found.", 404);
        try{
            await this.db.query(
                "UPDATE users SET is_flagged = $1 WHERE id = $2",
                [true, user_id]
            )
        }catch(err:any){
            throw new Error(err.message);
        }/*finally{
           SET UP MESSAGING ONCE FLAG USER IS TRIGGERED SEND EMAIL TO USER ABOUT ACCOUNT BEING FLAGGED 
           FOR SUSPICIOUS ACITVITY 
        }*/
    }
    async validatePassword({user_id, password}:User){
        if(!user_id) throw new AppError("User not found.", 404);
        if(!password) throw new AppError("Missing field. Please try again.", 400);
        try{
            const pass = await this.db.query(
                `SELECT password FROM users WHERE id = $1`,
                [user_id]
            );
			if(!pass.rows[0]) throw new AppError("Invalid credentials.", 401);

            const valid = await bcrypt.compare(password, pass.rows[0].password);
            if(!valid) throw new AppError("Invalid password dumbass.", 401)

            return true
        }catch(err){
            throw err;
        }
    }
	async updatePassword({user_id, password}:User){
		if(!user_id) throw new AppError("User not found.", 404);
		try{
			const safe = encrypt(password);
			await this.db.query(
				`UPDATE users
				SET password = $1
				WHERE id = $2
				`, [safe, user_id]	
			);
		}catch(err){
		 throw err;
		}
	}
}

