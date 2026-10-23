import request from "supertest";
import assert from "node:assert"
import app from "../../server.js";
import Auth from "../../auth/auth.js";
import bcrypt from "bcrypt";
import { encrypt } from "../../utils/encrypt.js";
import { describe, it, beforeEach, afterEach, after } from "node:test";
import { test_db } from "../../config/postgresql.config.js";


describe("POST /api/auth/delete",{timeout:10_000},  () => {
	let safeToken;
	let aToken;
	let rToken;
	let userId;
	let pass;

	const mockUser = {
		firstName: "jon",
		lastName: "doe",
		email: "testemail2@gmail.com",
		password: "test_password",
	};	

	beforeEach(async() => {
		pass = await bcrypt.hash(mockUser.password, 4);
		const res = await test_db.query(
			`INSERT INTO users(first_name,last_name,email,password)
				VALUES($1,$2,$3,$4)
				RETURNING id
			`,[mockUser.firstName,mockUser.lastName,mockUser.email, pass]	
		)
		userId = res.rows[0].id
		aToken = Auth.sign({ id: userId })
		rToken = Auth.signRefresh({ id: userId })
		safeToken = encrypt(rToken);
	});
	afterEach(async() => {
		await test_db.query(`TRUNCATE users CASCADE`);
	});

	it("deletes the user", async() => {
		const res = await request(app) 
			.delete('/api/auth/delete')
			.set('user', [`user=${userId}`])
			.set('Cookie', [`access_token=${aToken}; refresh_token=${safeToken};`])
			.send({ password: mockUser.password })
		assert.strictEqual(res.status, 200)
	})

	it("should fail due to invalid password", async() => {
		const res = await request(app) 
			.delete('/api/auth/delete')
			.set('user', [`user=${userId}`])
			.set('Cookie', [`access_token=${aToken}; refresh_token=${safeToken};`])
			.send({ password: "fail_password" })
		assert.strictEqual(res.status, 401)
	})

	it("should fail due to an unauthorized request", async() => {
		const res = await request(app) 
			.delete('/api/auth/delete')
			.set('user', [`user=${userId}`])
			.send({ password: "fail_password" })
		assert.strictEqual(res.status, 401)
	})

	after(async() => { 
		await test_db.query(`TRUNCATE users RESTART IDENTITY CASCADE`)
		await test_db.end();
	});

})
