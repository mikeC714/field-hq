import request from "supertest";
import { describe, before, after, beforeEach, afterEach, test } from "node:test";
import assert from "node:assert";
import { build } from "../../app.ts";
import jwt from "jsonwebtoken";
import { testDb } from "../../config/postgresql.ts";
import { resend } from "../../config/resend.ts"
import { user } from "../mock/user.ts";
import { quotes } from "../mock/quote.ts";
import bcrypt from "bcrypt";

describe("GET. Obtain the monthly stats", () => {
	let req:any;
	let server:any;
	let access:any;
	let refresh:any;


	before(async() => {
		server = await build(testDb, resend);
		req = request(server);
		try{
			const safe = await bcrypt.hash(user.password, 4); 
			const { rows } = await testDb.query(
				`INSERT INTO users
				(first_name, last_name, email, password)
				VALUES($1,$2,$3,$4)
				RETURNING id
				`,[user.firstName, user.lastName, user.email, safe]
			);

			access = jwt.sign({ payload: rows[0].id }, process.env.ACCESS!, { expiresIn: "15m" });
			refresh = jwt.sign({ payload: rows[0].id }, process.env.REFRESH!, { expiresIn: "1h" });

			await testDb.query("BEGIN")

				const insert = `
					WITH q AS(
						INSERT INTO quotes
						(user_key, total, markup, hourly)
						VALUES($1,$2,$3,$4)
						RETURNING id
					),
					l AS(
						INSERT INTO labor
						(quote_key, descr, hours)
						VALUES(q.id, $5, $6)
					),
					m AS(
						INSERT INTO materails
						(quote_key, descr, qty, unit_cost)
						VALUES(q.id, $8, $9, $10)
					)
				`; 

					
			await testDb.query("COMMIT")
		}catch(e:Error | any){
			await testDb.query("ROLLBACK")
			throw e;
		}	
	});
	
	describe("SUCCESS", () => {
		
		test("Successful fetch", async() => {
			const res = await req
						.get("/api/quote/monthly")
						.set("Cookie", [`access_token = ${access}`, `refresh_token = ${refresh}`])

			console.log(res)
		})
	});

	after(async() => {
		await testDb.query("TRUNCATE users CASCADE");
		await testDb.end();
	})
});
