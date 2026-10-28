export async function apiFetch(url:string, method:string = "GET", body?:any){
	try{
		const res  = await fetch(url, {
			method,
			headers:{
				"Content-type": "application/json"
			},
			body: typeof body === "object" ? JSON.stringify(body) : body
		}).then(res => res.json());
	
		return res;

	}catch(e:Error | any){
		throw e;
	}

}
