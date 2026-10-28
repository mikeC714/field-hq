import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts";
import { user } from "../mock/user.ts";
import bcrypt from "bcrypt"; 


describe("POST. Auth Signup testing", async() => {
	let server:any;
	let req:any;

	function MOCK(override?:any){
		return {
			...override,
			...user
		};
	};

	before(async() => {
		server = await build(testDb, resend)
		req = request(server);
	});

	describe("SUCCESS", () => {
		
		test("Sucessful signup", async() => {
			const res = await req
						.post("/api/auth/signup")
						.set("Content-type", "application/json")
						.send(user);
			assert.strictEqual(res.statusCode, 201);
		});	

	});
	
	describe("FAILURE", async() => {
	
		test("Fail due to duplicate user", async() => {

			before(async() => {
				try{
					const safe = await bcrypt.hash(user.password, 4);
					await testDb.query(
						`INSERT INTO users
						(first_name, last_name, email, password)
						VALUES($1,$2,$3,$4)
						`,[user.firstName, user.lastName, user.email, safe]
					);
				}catch(e){
					throw e;
				}
			});

			const res = await req
						.post("/api/auth/signup")
						.set("Content-type", "application/json")
						.send(user);

			assert.strictEqual(res.statusCode, 409);

			after(async() => {
				await testDb.query("TRUNCATE users CASCADE")
			})
		});

		test("Fail due to invalid email domain", async() => {
			const res = await req
						.post("/api/auth/signup")
						.set("Content-type", "application/json")
						.send(MOCK({ email:"superFake@onePiece.com" }));

			assert.strictEqual(res.statusCode, 409);
		});

	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE")
		await testDb.query("TRUNCATE tokens CASCADE")
		await testDb.end();
	})
});



