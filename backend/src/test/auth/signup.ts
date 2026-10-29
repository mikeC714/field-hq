import request from "supertest";
import { describe, before, after, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts";
import { user, insertUser } from "../mock/user.ts";


describe("POST. Auth Signup testing", async() => {
	let server:any;
	let req:any;

	async function MOCK(override?:any){
		return { 
			...user,
			...override
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

		after(async() => {
			await testDb.query("TRUNCATE users CASCADE");
		});
	});
	
	describe("FAILURE", async() => {

		test("Fail due to duplicate user", async() => {

			before(async() => {
				try{
					await insertUser(user, testDb);
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
				await testDb.query("TRUNCATE users CASCADE");
			})
		});

		test("Fail due to invalid email domain", async() => {
			const data = await MOCK({ email: "superFake@onePiece.com"})
			const res = await req
						.post("/api/auth/signup")
						.set("Content-type", "application/json")
						.send(data);

			assert.strictEqual(res.statusCode, 400);
		});


	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE")
		await testDb.query("TRUNCATE tokens CASCADE")
		await testDb.end();
	})
});



