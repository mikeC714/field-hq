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
	quote:{
		total:string | number;
		subTotal:string | number;
	};
	labor:{

	};
	materials:{

	};
};

interface QUOTE{
	id?:string;
	status:string;
	total:number;
	markup:number | float;
};

interface NEW_QUOTE{
	userId:string;
	customer:CUSTOMER;
	quote:QUOTE;
	labor:Array<LABOR>;
	materials:Array<MATERIALS>;
};


export { QUOTE, NEW_QUOTE, QUOTE_CONTENT };
