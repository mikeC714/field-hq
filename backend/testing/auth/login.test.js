import request from "supertest";
import assert from "node:assert"
import bcrypt from "bcrypt"
import app from "../../server.js";
import { describe, it, beforeEach, afterEach, after } from "node:test";
import { test_db } from "../../config/postgresql.config.js";
import { UserService } from "../../service/db/user.service.js";
const userService = new UserService(test_db);

describe("should flawlessly insert a new user and log said user in with provided credentials", () => {
	const mockUser = { first_name: "Jon", last_name: "Doe", email: "testemail2@gmail.com", password: "test_password" };

		beforeEach(async() => {
			const safe = await bcrypt.hash("test_password", 4); 
			await test_db.query(
				`INSERT INTO users(first_name, last_name, email, password)
					VALUES($1,$2,$3,$4)
				`,["Jon", "Doe", "testemail2@gmail.com", safe]
			)
		})	
		afterEach(async () => {
			await test_db.query(`TRUNCATE users CASCADE`)
		})

		it("This test should fail a user should not be found", async() => {
			const user = await userService.getUser("test2email@email.com");
			assert.strictEqual(user, undefined);
		})
		it("This test will test the entire route /api/auth/login, failing due to invalid email and credentials", async() => {
			const response = await request(app)
				.post('/api/auth/login')
				.send({email: "testemail@go_mokey_go_crazy.com", password: "uh-oh bad boy"})
				.set("Content-Type", "application/json")
			assert.strictEqual(response.status, 400);
		})
		it("This test will test the entire route /api/auth/login", async() => {
			const response = await request(app)
				.post('/api/auth/login')
				.send({email: mockUser.email, password: mockUser.password})
				.set("Content-Type", "application/json")

			assert.strictEqual(response.status, 200);
		})

		after(async() => {
			await test_db.query( `TRUNCATE users RESTART IDENTITY CASCADE`)
			await test_db.end();
		})

	})
