import type User from "./user.d.ts";
import type { Quote } from "./quote.d.ts";


interface ServiceRequire{
	user?: Pick<User, "user_id" | "email" | "first_name" | "last_name">;
	token?: string;
	quote?: Pick<Quote, "quote_id" | "customer_id" | "user_id" | "total" | "sub_total">;
}

export default ServiceRequire;
