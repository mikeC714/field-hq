import { AuthService } from "../auth/service/auth.ts";
import { TokenService } from "../auth/service/token.ts";
import { AppError, AuthError } from "../error/error.handler.js";
import { validateEmail, catchAsync } from "../lib/lib.ts";
import bcrypt from "bcrypt";

import type { Request, Response } from "express";
	

export class AuthController {
	private authService:AuthService;
	private tokenService:TokenService;

	constructor(authService:AuthService, tokenService:TokenService){
		this.authService = authService;
		this.tokenService = tokenService;
	}

	signup = catchAsync(async(req:Request,res:Response) => {
		const { email, firstName, lastName, password } = req.body;
		if(!firstName || !lastName || !email || !password) throw new AuthError("Missing fields, failed to provide all needed fields. Please try again.", 400);

		const validEmail = await validateEmail(email);
		if(!validEmail) throw new AuthError("Invalid email please provide a valid domain", 400);

		const safePass = await this.authService.hashPass(password, 16);
		const newUser = await this.authService.storeNewUser({ ...req.body, password: safePass });
		await this.tokenService.genCookies(res, newUser.id!);

		return res.status(201).json({
			user:{
				id: newUser.id,
				firstName,
				lastName
			}
		});
	});

	login = catchAsync(async(req:Request,res:Response) => {
		const { email, password } = req.body;
		if(email.length === 0 || !email) throw new AuthError("Invalid missing fields.", 400);

		const validEmail = await validateEmail(email);
		if(!validEmail) throw new AuthError("Invalid email please provide a valid domain", 400);

		const user = await this.authService.getUser(email);
		if(!user || user.password === undefined || user.id === undefined) throw new AuthError("Invalid Credentials");

		const valid = await bcrypt.compare(password, user.password);
		if(!valid) throw new AuthError("Invalid Credentials");

		await this.tokenService.genCookies(res, user.id);

		return res.status(200).json({
			user:{
				id: user.id,
				firstName: user.first_name,
				lastName: user.last_name
			}
		});
	});

	logout = catchAsync(async(req:Request,res:Response) => {
		const userId = await this.tokenService.verifyRefreshToken(req.cookies.refresh_token); 
		await this.tokenService.deleteRefreshToken(userId, req.cookies.refresh_token);

		res.clearCookie("access_token");
		res.clearCookie("refresh_token");

		return res.status(200).json({ success: true });
	});

	deleteUser = catchAsync(async(req:Request,res:Response) => {
		const { password } = req.body;
		const userId = await this.tokenService.verifyRefreshToken(req.cookies.refresh_token);
		const validUser = await this.authService.validatePassword(userId, password);
		if(validUser) await this.authService.deleteUser(userId);

		res.clearCookie("access_token");
		res.clearCookie("refresh_token");

		return res.status(200).json({ success: true });
	});


};

	export const currUser = catchAsync(async(req,res) => {
        const id = req.user;
        if(!id) throw new AppError("Failed to provide user id.", 400);
        const user = await userService.getUserById(id);  
        if(!user) throw new AppError("User not found.", 404);		
        return res.status(200).json({ user });
	});



