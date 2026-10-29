import dotenv from "dotenv";
const envPath = new URL("./.env", import.meta.url).pathname;
dotenv.config({ path: envPath});
import request from "supertest";
import { describe, before, after, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts";
import { user, insertUser } from "../mock/user.ts";
import { crypt } from "../../lib/lib.ts";


describe("POST. Auth Logout testing", async() => {
	let server:any;
	let req:any;
	let tokens:any;
	let userId:any;


	async function SIGN_TOKENS(override?:any){
		const payload = userId;  

		const secretA = override?.access === undefined ? process.env.ACCESS : override.access ;
		const secretR = override?.refresh === undefined ?  process.env.REFRESH : override.refresh;
		console.log("GOT SECRETS")

		const expiryA = override?.expA === undefined ? process.env.ACCESS_EXP : override.expA;
		const expiryR = override?.expR === undefined ? process.env.REFRESH_EXP : override.expR;
		console.log("GOT EXPIRY")

		const access = jwt.sign({ payload }, secretA as any, { expiresIn: expiryA as any });
		let refresh = jwt.sign({ payload }, secretR as any, { expiresIn: expiryR as any });

		refresh = crypt.encrypt(refresh);

		console.log("SIGNED AND ECRYPTED")
		return {
			access,
			refresh
		};
	};

	before(async() => {
		try{
			server = await build(testDb, resend);
			req = request(server);
			userId = await insertUser(user, testDb);	

			tokens = await SIGN_TOKENS();

			await testDb.query(
				`INSERT INTO tokens
				(user_id, token)
				VALUES($1,$2)
				`,[userId, tokens.refresh]
			);
		}catch(e){
			throw e;
		}

	});

	describe("SUCCESS", () => {

		test("Sucessful logout", async() => {

			const res = await req
						.post("/api/auth/logout")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])

			assert.strictEqual(res.statusCode, 200);
		});	

	});
	
	describe("FAILURE", async() => {

		const tokens = await SIGN_TOKENS({ 
			access:"somethingSus", 
			refresh:"somethingEvenMoreSus" 
		});

		test("Fail due to invalid cookies", async() => {


			const res = await req
						.post("/api/auth/signup")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])

			assert.strictEqual(res.statusCode, 401);

		});


		test("Fail due to expired cookies", async() => {

			const tokens = await SIGN_TOKENS({
				expA:"-15m", 
				expR:"-1h" 
			});

			const res = await req
						.post("/api/auth/signup")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])

			assert.strictEqual(res.statusCode, 401);
		});
	});

	after(async() => {
		await testDb.query("TRUNCATE tokens CASCADE")
		await testDb.end();
	});
});



