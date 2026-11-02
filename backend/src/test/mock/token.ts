import dotenv from "dotenv";
const envPath = new URL("./.env", import.meta.url).pathname;
dotenv.config({ path: envPath});
import { crypt } from "../../lib/lib.ts";
import jwt from "jsonwebtoken";

export async function signTokens(userId:string, override?:any){
	const payload = userId;

	const secretA = override?.access === undefined ? process.env.ACCESS : override.access ;
	const secretR = override?.refresh === undefined ?  process.env.REFRESH : override.refresh;
	const expiryA = override?.expA === undefined ? process.env.ACCESS_EXP : override.expA;
	const expiryR = override?.expR === undefined ? process.env.REFRESH_EXP : override.expR;


	const access = jwt.sign({ payload }, secretA as any, { expiresIn: expiryA as any });
	let refresh = jwt.sign({ payload }, secretR as any, { expiresIn: expiryR as any });

	refresh = crypt.encrypt(refresh);

	return {
		access,
		refresh
	};
};
