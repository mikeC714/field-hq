import type { CUSTOMER } from "./customer.d.ts";
import type { LABOR } from "./labor.d.ts";
import type { MATERIALS } from "./materials.d.ts";

interface QUOTE_CONTENT{
	user:{
		firstName:string;
		lastName:string;
		email:string;
		phone:string;
	};
	customer:{
		firstName:string;
		lastName:string;
		email:string;
	};
	quote:QUOTE;
	labor:LABOR;
	materials:MATERIALS;
};

interface QUOTE{
	id?:string;
	status:string;
	total:string;
	hourlyRate:string;
	markup:string;
};

interface NEW_QUOTE{
	userId:string;
	customer:CUSTOMER;
	quote:QUOTE;
	labor:Array<LABOR>;
	materials:Array<MATERIALS>;
};


export { QUOTE, NEW_QUOTE, QUOTE_CONTENT };
