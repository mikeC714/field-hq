import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user, insertUser } from "../mock/user.ts";
import { signTokens } from "../mock/token.ts";
import { insertQuote } from "../mock/quote.ts";
import { randomUUID } from "node:crypto";



describe("DELETE. Should successfully delete quote and everything regarding the quote (labor, materials, quote_token)", () => {
	let server:any;
	let req:any;

	let userId:any;
	let userId2:any;

	let tokens:any;
	let tokens2:any;

	let quoteId:any;
	let quoteId2:any;
	
	before(async() => {
		server = await build(testDb, resend);
		req = request(server);

		userId = await insertUser(user, testDb);
		userId2 = await insertUser(user, testDb, { email:"secondTestUser2@yahoo.com" });

		tokens = await signTokens(userId);
		tokens2 = await signTokens(userId2);

		quoteId = await insertQuote(testDb, userId);
		quoteId2 = await insertQuote(testDb, userId2);
	});

	describe("SUCCESS", () => {

		test("Delete Quote", async() => {
			const res = await req
						.delete("/api/quote/delete")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
						.send({ quoteId });

			assert.strictEqual(res.statusCode, 200);
		});
	});


	describe("FAIL", () => {

		test("Attempt to delete quote with invalid quoteId", async() => {
			const quoteId = randomUUID();

			const res = await req
						.delete("/api/quote/delete")
						.set("Cookie", [`access_token=${tokens?.access}`, `refresh_token=${tokens?.refresh}`])
						.send( { quoteId });
		
			assert.strictEqual(res.statusCode, 404);
		});

		test("Attempt to delete quote that is not assigned to designated userId", async() => {
			const res = await req
						.delete("/api/quote/delete")
						.set("Cookie", [`access_token=${tokens2?.access}`, `refresh_token=${tokens2?.refresh}`])
						.send({ quoteId });
		
			assert.strictEqual(res.statusCode, 404);
		});


		test("Attempt to delete quote with invalid session", async() => {

			const res = await req
						.delete("/api/quote/delete")
						.set("Content-Type", "application/json")
						.send({ quoteId });
		
			assert.strictEqual(res.statusCode, 401);

		});
	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE");
		await testDb.end();
	});

});



