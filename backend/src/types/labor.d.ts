export interface LABOR{
	id?:string;
	description:string | Array<string>;
	hours:number;
	hourlyRate:number | float;
	total:number | float;
}
