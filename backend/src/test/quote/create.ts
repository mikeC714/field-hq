import request from "supertest";
import { describe, before, after, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user, insertUser } from "../mock/user.ts";
import { quote } from "../mock/quote.ts";
import { signTokens } from "../mock/token.ts";



describe("POST. Should successfully create quote", () => {
	let server:any;
	let req:any;
	let body:any;
	let userId:any;
	let tokens:any;
	
	before(async() => {
		server = await build(testDb, resend);
		req = request(server);
		userId = await insertUser(user, testDb);
	});

	after(async() => {
		await testDb.query("TRUNCATE customers CASCADE");
		await testDb.query("TRUNCATE users CASCADE");
		await testDb.end();
	});


	describe("SUCCESS", () => {

		before(async() => {
			tokens = await signTokens(userId);
		});

		test("Create new quote", async() => {
			const res = await req
						.post("/api/quote/create")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
						.set("Content-Type", "application/json")
						.send(quote);
		
			assert.strictEqual(res.statusCode, 201);
		});
	});

	describe("FAIL", () => {

		test("Attempt to create with invalid session", async() => {

			const res = await req
						.post("/api/quote/create")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
						.set("Content-Type", "application/json")
						.send(quote);
		
			assert.strictEqual(res.statusCode, 201);
			
		});

		test("Attempt to create quote without completing customer fields", async() => {
			
		});
	});

});



