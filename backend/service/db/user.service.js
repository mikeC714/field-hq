import bcrypt from "bcrypt";
import { AppError } from "../../error/error.handler.js";
import { encrypt } from "../../utils/encrypt.js";

export class UserService{
	constructor(db){
		this.db = db;
	}
	async storeNewUser(firstName, lastName, email, password){
        if(!firstName || !lastName || !email || !password) throw new AppError("Missing field. Please try again.", 400);
        try{
            const results = await this.db.query(
                "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, first_name, last_name, email",
                [firstName, lastName, email, password]
            );
            
            return results.rows[0]; 
        }catch(err){
            throw err;
        }
    }
    async getUser(email){
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
    async getUserById(user){
        if(!user) throw new AppError("User not found.", 404);
        try{
            const results = await this.db.query(
                "SELECT id, first_name, last_name, email, created_at FROM users WHERE id = $1",
                [user]
            );
			return results.rows[0];
        }catch(err){
            throw err;
        }
    }
    async deleteUser(userId){
        if(!userId) throw new AppError("User not found.", 404);
        try{
            await this.db.query(
                `DELETE FROM users WHERE id = $1`,
                [userId]
            );
        }catch(err){
            throw err;
        }
    }
    async flagUser(userId){
        if(!userId) throw new AppError("User not found.", 404);
        try{
            await this.db.query(
                "UPDATE users SET is_flagged = $1 WHERE id = $2",
                [true, userId]
            )
        }catch(err){
            throw new Error(err.message);
        }/*finally{
           SET UP MESSAGING ONCE FLAG USER IS TRIGGERED SEND EMAIL TO USER ABOUT ACCOUNT BEING FLAGGED 
           FOR SUSPICIOUS ACITVITY 
        }*/
    }
    async validatePassword(userId, password){
        if(!userId) throw new AppError("User not found.", 404);
        if(!password) throw new AppError("Missing field. Please try again.", 400);
        try{
            const pass = await this.db.query(
                `SELECT password FROM users WHERE id = $1`,
                [userId]
            );
			if(!pass.rows[0]) throw new AppError("Invalid credentials.", 401);

            const valid = await bcrypt.compare(password, pass.rows[0].password);
            if(!valid) throw new AppError("Invalid credentials.", 401)

            return true
        }catch(err){
            throw err;
        }
    }
	async updatePassword(userId, password){
		if(!userId) throw new AppError("User not found.", 404);
		try{
			const safe = encrypt(password);
			await this.db.query(
				`UPDATE users
				SET password = $1
				WHERE id = $2
				`, [safe, userId]	
			);
		}catch(err){
		 throw err;
		}
	}
}

