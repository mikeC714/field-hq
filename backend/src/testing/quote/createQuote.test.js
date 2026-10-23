import request from "supertest";
import assert from "node:assert"
import app from "../../server.js";
import Auth from "../../auth/auth.js";
import { encrypt } from "../../utils/encrypt.js";
import { describe, it, beforeEach, after, afterEach } from "node:test";
import { test_db } from "../../config/postgresql.config.js";



describe("POST /api/quote/create", () => {	
	let safeToken;
	let aToken;
	let rToken;
	let userId;

	const mockUser = { 
		first_name: "Jon", 
		last_name: "Doe", 
		email: "testemail3@gmail.com", 
		password: "test_password" 
	};
	const mockData ={
		customer:{
			firstName: "Billy",
			lastName: "Bob",
			email: "testEmal@yahoo.com",
			phone: "(222)-333-1922",
			address: 12344,
		},
		quote:{
			status:"APPROVED",
			markup:10,
			total:1100,
		},
		labor:[{
            description: "TEST TEST",
            hours: 20,
            hourlyRate: 12, 
            total:240 
		}],
		materials:[{
			description: "TEST TEST",
			quantity: 20,
			unitCost: 10,
			total: 200
		}],
	}
	const badData ={
		customer:{
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			address: ""
		},
		quote:{
			status:"APPROVED",
			markup:10,
			total:1100,
		},
		labor:[{
            description: "TEST TEST",
            hours: 20,
            hourlyRate: 12, 
            total:240 
		}],
		materials:[{
			description: "TEST TEST",
			quantity: 20,
			unitCost: 10,
			total: 200
		}],
	}
	beforeEach(async() => {
		const res = await test_db.query(
			`INSERT INTO users(first_name, last_name, email, password)
				VALUES($1,$2,$3,$4)
				RETURNING id
			`,[mockUser.first_name, mockUser.last_name, "testEmail4@gmail.com", mockUser.password]
		) 
		userId = res.rows[0].id
		aToken = Auth.sign({ id: userId })
		rToken = Auth.signRefresh({ id: userId })
		safeToken = encrypt(rToken);
	})


	afterEach(async() => {
		await test_db.query(`TRUNCATE users CASCADE`)
		await test_db.query(`TRUNCATE customers CASCADE`)
		await test_db.query(`TRUNCATE quote_tokens CASCADE`)
	})

	it("should fail, due to not providing cusotmer info.", async () =>{
		const req = await request(app)
			.post('/api/quote/create')
			.set('user', `[user=${userId}]`)
			.set('Cookie', [`access_token=${aToken}; refresh_token=${safeToken};`])
			.set('Content-Type', 'application/json')
			.send(badData);
		assert.strictEqual(req.status, 400);
	})

	it("testing happy path. Should create quote.", async() => {
		const req = await request(app)
			.post('/api/quote/create')
			.set('user', `[user=${userId}]`)
			.set('Cookie', [`access_token=${aToken}; refresh_token=${safeToken};`])
			.set('Content-Type', 'application/json')
			.send(mockData);	
		assert.strictEqual(req.status, 200)

	})

	after(async() => {
		await test_db.query(`TRUNCATE users CASCADE`)
		await test_db.query(`TRUNCATE customers CASCADE`)
		await test_db.query(`TRUNCATE quote_tokens CASCADE`)
		await test_db.end();
	})
})







