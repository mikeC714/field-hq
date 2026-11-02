import dotenv from "dotenv";
const envPath = new URL("./.env", import.meta.url).pathname;
dotenv.config({ path: envPath});
import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts";
import { user, insertUser } from "../mock/user.ts";
import { signTokens } from "../mock/token.ts";



describe("POST. Auth Logout testing", async() => {
	let server:any;
	let req:any;
	let tokens:any;
	let userId:any;


	before(async() => {
		try{
			server = await build(testDb, resend);
			req = request(server);
			userId = await insertUser(user, testDb);	

			tokens = await signTokens(userId);

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

		const tokens = await signTokens(userId,{ 
			access:"somethingSus", 
			refresh:"somethingEvenMoreSus" 
		});

		test("Fail due to invalid cookies", async() => {

			const res = await req
						.post("/api/auth/logout")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])

			assert.strictEqual(res.statusCode, 401);

		});


		test("Fail due to expired cookies", async() => {
			const res = await req
						.post("/api/auth/logout")

			assert.strictEqual(res.statusCode, 401);
		});
	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE")
		await testDb.query("TRUNCATE tokens CASCADE")
		await testDb.end();
	});
});



