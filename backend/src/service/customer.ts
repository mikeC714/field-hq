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

	getCustomerDetails = async(customerIds:Array<string>, userId:string) => {
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


// GO TO QUOTEs
		//   async customerQuoteInfo(quotes){
		//       if(!quotes || quotes.length === 0){
		//           return {
		//               quotes: [], jobs: []
		//           }
		//       }
		//       try{
		//           const quotedJobs = await Promise.all(
		//               quotes.map(async quote => {
		//                   const jobInfo = await JobService.getJobInfo([quote]);
		//                   return {
		//                       ...quote,
		//                       job: jobInfo
		//                   }
		//               })
		//           );
		//           return quotedJobs
		//       }catch(err){
		//       	throw err;
		// }
		//   }

