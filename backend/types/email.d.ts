import type User from "./user.ts";
import type { Materials, Labor, Quote } from "./quote.d.ts"

interface Email{
	user:User;
	customer:Customer;
	quote:Quote;
	materials:Materials;
	labor:Labor;
	expiry:string;
	link:string;
	token:string;
}

export default Email;
