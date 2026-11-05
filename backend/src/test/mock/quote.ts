const quoteMock = {
	quote:{
		hourlyRate:"2000",
		markup:"10.2",
		total:"100",
		status:"pending",
	},
	customer:{
		firstName:"Joe",
		lastName:"Smith",
		email:"superDuperFakeemial@email.com",
		phone:"(410) 888-1240",
		address:"123 Happy St.",
	},
	labor:[
		{
			desc:"Changed light bulb",
			hours:1,
		},
		{
			desc:"Changed outlet",
			hours:4,
		},
		{
			desc:"Pool install",
			hours:10,
		},
		{
			desc:"Panel install",
			hours:12,
		},
	],
	materials:[
		{
			desc:"light bulb",
			quantity:1,
			unitCost:200,
		},
		{
			desc:"2 AWG Wire 50ft",
			quantity:1,
			unitCost:500,
		},
		{
			desc:"Panel",
			quantity:1,
			unitCost:220,
		},
		{
			desc:"Pool",
			quantity:1,
			unitCost:10000,
		},
	]
};

async function insertQuote(testDb:any, userId:string){
	const { quote, customer, labor, materials } = quoteMock;
	try{

		await testDb.query("BEGIN");

			const { rows } = await testDb.query(
				`WITH c AS (
				 INSERT INTO customers
				 (user_id, first_name, last_name, phone, email, address)
				 VALUES ($1, $2, $3, $4, $5, $6)
				 RETURNING id
				)
				INSERT INTO quotes
				(customer_id, status, hourly, markup, total)
				SELECT c.id, $7, $8, $9, $10 
				FROM c
				RETURNING id, customer_id, created_at;
				`,[userId, customer.firstName, customer.lastName, customer.phone, customer.email, customer.address, quote.status, quote.hourlyRate, quote.markup, quote.total]
			); 


			const quoteId = rows[0].id;

			for(const lab of labor){
				await testDb.query(
					`INSERT INTO labor
					(quote_key, descr, hours)
					VALUES($1,$2,$3)
					`,[quoteId, JSON.stringify(lab.desc), lab.hours]
				);
			}

			for(const mat of materials){
				await testDb.query(
					`INSERT INTO materials 
					(quote_key, descr, qty, unit_cost)
					VALUES($1,$2,$3,$4)
					`,[quoteId, JSON.stringify(mat.desc), mat.quantity, mat.unitCost]
				);
			};

		await testDb.query("COMMIT");

		return quoteId;
		
	}catch(err){
		await testDb.query("ROLLBACK");
		throw err;
	}
};


export { quoteMock, insertQuote };
