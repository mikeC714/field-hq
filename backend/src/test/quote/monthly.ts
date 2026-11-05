import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user, insertUser } from "../mock/user.ts";
import { signTokens } from "../mock/token.ts";
import { insertQuote } from "../mock/quote.ts";

describe("GET. Obtain the monthly stats", () => {
	let req:any;
	let server:any;
	let tokens:any;
	let userId:any;

	before(async() => {
		server = await build(testDb, resend);
		req = request(server);
		userId = await insertUser(user, testDb);
		tokens = await signTokens(userId)
		await insertQuote(testDb, userId);
	});
	
	describe("SUCCESS", () => {
		
		test("Successfully obtain the monthly data", async() => {
			const res = await req
						.get("/api/quote/monthly")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
			assert.strictEqual(res.statusCode, 200);
			assert.deepStrictEqual(res.body, { quote:{}, monthlyTotal:0 });
		});

	});

	describe("FAILURE", () => {
		
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
