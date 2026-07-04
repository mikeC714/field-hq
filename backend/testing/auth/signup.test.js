import request from "supertest";
import assert from "node:assert"
import app from "../../server.js";
import { describe, it, beforeEach, afterEach, after } from "node:test";
import { test_db } from "../../config/postgresql.config.js";

describe("POST /api/auth/signup", () => {
	const mockuser = {
		first_name: "jon",
		last_name: "doe",
		email: "testemail2@gmail.com",
		password: "test_password",
	};

	const signup = (overRides = {}) =>
		request(app)
			.post("/api/auth/signup")
			.send({
				email: mockuser.email,
				firstName: mockuser.first_name,
				lastName: mockuser.last_name,
				password: mockuser.password,
				...overRides
			})
	.set("content-type", "application/json");

	afterEach(async () => {
		await test_db.query(`TRUNCATE USERS CASCADE`);
	});

	it("creates a new user and returns their name and email", async () => {
		const response = await signup();
		assert.strictEqual(response.status, 201);
	});

	describe("when the email is already registered", () => {
	beforeEach(async () => {
		await test_db.query(
		`INSERT INTO users(first_name, last_name, email, password)
			VALUES($1,$2,$3,$4)`,
		[mockuser.first_name, mockuser.last_name, mockuser.email, mockuser.password]
		);
	});

	it("fails with 409", { timeout: 10000 }, async () => {
			const response = await signup();
			assert.strictEqual(response.status, 409);
		});
	});

	describe("when the email is invalid", () => {
		it("fails with 400", async () => {
			const response = await signup({ email: "not-an-email" });
			assert.strictEqual(response.status, 400);
		});
	});

	after(async() => {
		await test_db.query(`TRUNCATE users RESTART IDENTITY CASCADE`)
		await test_db.end();
	})
});
