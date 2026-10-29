import bcrypt from "bcrypt";
import { AppError, AuthError } from "../../error/error.ts";
import type { USER, USER_QUERY } from "../../types/user.d.ts";

export class AuthService{
	db:any;
	constructor(db:any){ this.db = db };

	hashPass = async(password:string, rounds:number):Promise<string> => {
		if(!password) throw new AppError("Failed to provide password", 400);
		try{
			const safePass = await bcrypt.hash(password, rounds);
			return safePass;
		}catch(e){
			throw e;
		};
	}	

	storeNewUser = async(user:USER):Promise<USER> => {
		const { firstName, lastName, email, password } = user;
		if(!firstName || !lastName || !email || !password) throw new AppError("Missing field. Please try again.", 400);
		try{
			const results = await this.db.query(
			    `INSERT INTO users (first_name, last_name, email, password) 
			    VALUES ($1, $2, $3, $4) 
			    RETURNING id, first_name, last_name, email`
			    , [firstName, lastName, email, password]
			);

			return results.rows[0]; 
		}catch(err:Error | any){
			if(err.code === "23505" || err.statusCode === "23505") throw new AuthError("Invalid credentials", 409);
			throw err;
		};
	};

	getUser = async(email:string):Promise<USER_QUERY> => {
		if(!email) throw new AppError("Invalid credentials.", 400);
		try{
			  const results = await this.db.query(
				`SELECT id, first_name, last_name, email, password 
				FROM users WHERE email = $1`
				, [email]
			  );
			  return results.rows[0];
		  }catch(err){
			throw err;
		};
    	};

	getUserById = async(user:string):Promise<USER> => {
		if(!user) throw new AppError("User not found.", 404);
		try{
			const results = await this.db.query(
			    `SELECT id, first_name, last_name, email, created_at FROM users 
			    WHERE id = $1`
			    , [user]
			);

			return results.rows[0];
		}catch(err){
			throw err;
		};
	};


	deleteUser = async(userId:string) => {
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

	flagUser = async(userId:string) => {
        if(!userId) throw new AppError("User not found.", 404);
        try{
            await this.db.query(
                "UPDATE users SET is_flagged = $1 WHERE id = $2",
                [true, userId]
            )

		//log flag
        }catch(err:Error | any){
            throw new Error(err.message);
        }
    }
	validatePassword = async(userId:string, password:string):Promise<boolean> => {
		if(!userId) throw new AppError("User not found.", 404);
		if(!password) throw new AppError("Missing field. Please try again.", 400);
		try{
			const { rows } = await this.db.query(
			    `SELECT password FROM users WHERE id = $1`,
			    [userId]
			);
				if(!rows[0]) throw new AppError("Invalid credentials.", 401);

			const valid = await bcrypt.compare(password, rows[0].password);
			if(!valid) throw new AppError("Invalid password dumbass.", 401)

			return true;
		}catch(err){
			throw err;
		}
	};

	updatePassword = async(userId:string, password:string) => {
		if(!userId) throw new AppError("User not found.", 404);
		try{
			const safe = this.hashPass(password, 16);
			await this.db.query(
				`UPDATE users
				SET password = $1
				WHERE id = $2
				`, [safe, userId]	
			);
		}catch(err){
			throw err;
		};
	};
};

