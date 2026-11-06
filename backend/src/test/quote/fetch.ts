import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user, insertUser } from "../mock/user.ts";
import { signTokens } from "../mock/token.ts";
import { insertQuote } from "../mock/quote.ts";

describe("GET. Fetch quotes", () => {
	let req:any;
	let server:any;
	let tokens:any;
	let tokens2:any;
	let userId:any;
	let userId2:any;

	before(async() => {
		server = await build(testDb, resend);
		req = request(server);
		userId = await insertUser(user, testDb);
		userId2 = await insertUser(user, testDb, { email:"superDuperFakeEamil@yahoo.com" });
		tokens = await signTokens(userId);
		tokens2 = await signTokens(userId2);
		await insertQuote(testDb, userId);
	});
	
	describe("SUCCESS", () => {
		
		test("Successfully obtain the quotes", async() => {
			const res = await req
						.get("/api/quote")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`]);

			console.log(res);
			assert.strictEqual(res.statusCode, 200);
		});

		test("Successfully obtain the quotes but without having customers", async() => {
			const res = await req
						.get("/api/quote")
						.set("Cookie", [`access_token=${tokens2?.access}`, `refresh_token=${tokens2?.refresh}`]);

			assert.strictEqual(res.statusCode, 200);
		});

	});

	describe("FAILURE", () => {

		test("Fail to obtain quotes with malicous cookies", async() => {
			const tokens = await signTokens(userId,{ 
				access:"somethingSus", 
				refresh:"somethingEvenMoreSus" 
			});

			const res = await req
						.get("/api/quote/monthly")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`]);

			assert.strictEqual(res.statusCode, 401);
		});
		
		test("Fail due to expired cookies", async() => {
			const res = await req
						.get("/api/quote/monthly")

			assert.strictEqual(res.statusCode, 401);
		});

	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE");
		await testDb.end();
	})
});
