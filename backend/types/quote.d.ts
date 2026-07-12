type MaterialsBody = {
	description:string
	unit_cost:number;
	quantity:number;
	total?:number;
}

export interface Materials{
	items:Array<MaterialsBody>;
}

type LaborBody = {
	description:string;
	hourly_rate:number;
	hours:number;
	total?:number;
}
export interface Labor{
	items:Array<LaborBody>;
}


export interface Quote{
	id?:string;
	quote_id?:string;
	customer_id?:string;
	user_id?:string;
	status?:string;
	total?:number;
	sub_total?:number;
}

