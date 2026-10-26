import { AuthError } from "../error/error.handler.js";

export class CustomerService{
	private db:any;

	constructor(db:any){
		this.db = db;
	};

	getAllCustomerIds = async(userId:string) => {
		if(!userId) throw new AuthError("User not found.", 404);
		try{
			const { rows } = await this.db.query(
				`SELECT id
				FROM customers
				WHERE user_id = $1
				`,[userId]
			);
			return rows.map((vals:{id:string}) => vals.id); 

		}catch(e:Error | any){
			throw e;
		};
	}; 

	getAllCustomerInfo = async(userId:string) => {
		if(!userId) throw new AuthError("Invalid user.", 404);
		try{
			const { rows } = await this.db.query(
				`SELECT * 
				FROM customers
				WHERE user_id = $1
				`,[userId]
			);

			return rows;
		}catch(e:Error | any){
			throw e;
		};
	};

	getCustomerInfo = async(customerIds:Array<string>, userId:string) => {
		if(!userId) throw new AuthError("Invalid user.", 404);
		try{
			const { rows } = await this.db.query(
				`SELECT *
				FROM customers
				WHERE user_id = $1
				AND id = ANY($2)
				`,[userId, customerIds]
			);

			return rows;
		}catch(e:Error | any){
			throw e;
		};
	};
};


