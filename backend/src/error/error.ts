export class AppError extends Error{
	statusCode:number;
	constructor(message:string, statusCode:number = 400){
		super(message);
		this.statusCode = statusCode || 400;
		this.name = "AppError";
		Error.captureStackTrace(this, this.constructor)
	}
}

export class AuthError extends AppError{
	constructor(message = "Authentication error", statusCode = 401){
		super(message, statusCode);
		this.name = "AuthenticationError"; 
		this.statusCode = statusCode;
	}
}

