import type { Request } from "express";

interface USER{
	id?:string;
	firstName?:string;
	lastName?:string;
	email:string;
	password?:string;
};
interface USER_QUERY{
	id?:string;
	first_name?:string;
	last_name?:string;
	email?:string;
	password?:string;
};


export { USER, USER_QUERY }
