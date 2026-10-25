import type { CUSTOMER } from "./customer.d.ts";
import type { LABOR } from "./labor.d.ts";
import type { MATERIALS } from "./materials.d.ts";


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


