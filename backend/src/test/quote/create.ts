import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user, insertUser } from "../mock/user.ts";
import { quoteMock } from "../mock/quote.ts";
import { signTokens } from "../mock/token.ts";



describe("POST. Should successfully create quote", () => {
	let server:any;
	let req:any;
	let userId:any;
	let tokens:any;
	
	before(async() => {
		server = await build(testDb, resend);
		req = request(server);
		userId = await insertUser(user, testDb);
			tokens = await signTokens(userId);
	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE");
		await testDb.query("TRUNCATE customers CASCADE");
		await testDb.end();
	});


	describe("SUCCESS", () => {

		test("Create new quote", { timeout:1_000 }, async() => {
			const res = await req
						.post("/api/quote/create")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
						.set("Content-Type", "application/json")
						.send(quoteMock);
			assert.strictEqual(res.statusCode, 201);
		});
	});


	describe("FAIL", () => {

		test("Attempt to create quote without completing customer fields", async() => {
			const body = delete quoteMock.customer;

			const res = await req
						.post("/api/quote/create")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
						.set("Content-Type", "application/json")
						.send(body);
		
			assert.strictEqual(res.statusCode, 400);
			
		});

		test("Attempt to create quote with invalid session", async() => {

			const res = await req
						.post("/api/quote/create")
						.set("Content-Type", "application/json")
						.send(quoteMock);
		
			assert.strictEqual(res.statusCode, 401);

		});
	});

});



