import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user, insertUser } from "../mock/user.ts";


describe("POST. Auth Login testing", async() => {
	let req:any;
	let server:any;

	before(async() => {
		try{
			server = await build(testDb, resend);
			req = request(server);
			await insertUser(user, testDb);

		}catch(e:Error | any){
			throw e;
		}
	});

	describe("SUCCESS", () => {

		test("Successful login", { timeout:5000 }, async() => {
			const res = await req
						.post("/api/auth/login")
						.set("Content-type", "application/json")
						.send({ email:user.email, password:user.password });

			assert.strictEqual(res.statusCode, 200);
		});
				
	});

	describe("FAILURES", () => {

		test("Fail due to invalid user", { timeout:5000 }, async() => {
			const res = await req
						.post("/api/auth/login")
						.set("Content-type", "application/json")
						.send({ email:"superDuperFake@gmail.com", password:user.password});

			assert.strictEqual(res.statusCode, 401);
		});

		test("Fail due to invalid user", { timeout:5000 }, async() => {
			const res = await req
						.post("/api/auth/login")
						.set("Content-type", "application/json")
						.send({ email:user.email, password:"fakePassword"});

			assert.strictEqual(res.statusCode, 401);
		});


		test("Fail due to excessive requests", { timeout:5000 }, async() => {
			for(let i = 0; i <= 5; i++){
				await req
					.post("/api/auth/login")
					.set("Content-type", "application/json")
					.send({ email:"fakeEmail", password:"fakePassword"});
			};

			const res = await req
						.post("/api/auth/login")
						.set("Content-type", "application/json")
						.send({ email:user.email, password:user.password});

			assert.strictEqual(res.statusCode, 429);
		});

	});	

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE")
		await testDb.query("TRUNCATE tokens CASCADE")
		await testDb.end();
	});

});


