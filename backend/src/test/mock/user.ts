import bcrypt from "bcrypt"; 


interface USER{

	firstName:string;
	lastName:string;
	email:string;
	password:string;
};


const user = {
	firstName:"Joe",
	lastName:"Shmoe",
	email:"superFakeEmail@gmail.com",
	password:"superDuperSecret"
};

async function insertUser(user:USER, testDb:any){
	const safe = await bcrypt.hash(user.password, 4); 
	const { rows } = await testDb.query(
		`INSERT INTO users
		(first_name, last_name, email, password)
		VALUES($1, $2, $3, $4)
		RETURNING id
		`,[user.firstName, user.lastName, user.email, safe]
	);

	return rows[0].id;
};


export { user, insertUser };
