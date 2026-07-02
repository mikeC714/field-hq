import Auth from "../auth/auth.js";
import userService from "../service/db/user.service.js";
import tokenService from "../service/db/token.service.js";
import { decrypt } from "../utils/encrypt.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError, AuthenticationError } from "../error/error.handler.js";
import { validateEmail } from "../utils/emailValidator.js";
import bcrypt from "bcrypt";
	
	export const login = catchAsync(async (req, res) => {
        const { email, password } = req.body;
        if(!email || !password){
            throw new AppError("Invalid, Missing fields.", 400);
        }

		const validEmail = validateEmail(email);
		if(!validEmail) throw new AppError("Invalid email please provide a valid domain.", 400);
        
        const user = await userService.getUser(email);
        if(!user) throw new AuthenticationError("Invalid credentials.");

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) throw new AuthenticationError("Invalid credentials.");

        const token = Auth.sign({ id: user.id });
		const refreshToken = Auth.signRefresh({ id: user.id });
		const safe = await tokenService.storeRefreshToken(user.id , refreshToken);    
			
		res.cookie("access_token", token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 900000 // 15M
        })
        res.cookie("refresh_token", safe, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 604800000 // 7D
        })

        return res.status(200).json({ 
            user: {
                firstName: user.first_name,
                lastName: user.last_name
            }
		});
	});

    export const signup = catchAsync(async (req, res) => {
        const { email, firstName, lastName, password } = req.body;
        if(!firstName || !lastName || !email || !password) throw new AppError("Missing Field. Please try again", 400);
            
		const validEmail = validateEmail(email);
		if(!validEmail) throw new AppError("Invalid email please provide a valid domain.", 400);

		const rounds = 16
		const salt = await bcrypt.genSalt(rounds);
		const safePass = await bcrypt.hash(password, salt);
       
		const user = await userService.storeNewUser(firstName, lastName, email, safePass);
		if(!user) throw new AppError("Invalid Credentials.", 401);

        const token = Auth.sign({id: user.id });
        const refreshToken = Auth.signRefresh({id: user.id});
       	const safe = await tokenService.storeRefreshToken(user.id, refreshToken);

        res.cookie("access_token", token,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 900000 // 15M
        })
        res.cookie("refresh_token", safe, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 604800000 // 7D
        })

        return res.status(201).json({
            user:{
                firstName: user.first_name,
                lastName: user.last_name
            }
        });
	});
    
    export const logout = catchAsync(async (req, res) => {
        const refresh = req.cookies.refresh_token;
        if(!refresh) throw new AuthenticationError("Failed to provide valid token.");
		
		const decryptedRefresh = decrypt(refresh);
        
		const verified = Auth.verifyRefresh(decryptedRefresh);
		if(!verified) throw new AuthenticationError("Failed to provide valid token.");	

		const decode = Auth.decode(decryptedRefresh);

    	await tokenService.deleteRefreshToken(decode.payload.id, refresh);

        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

        return res.status(200).json({ success: true });
    });


    export const deleteUserAcc = catchAsync(async(req, res) => {
        const { password } = req.body;
		const user = req.user;
        if(!password) throw new AppError("Missing field. Please try again.", 400);
        
		const refresh = req.cookies.refresh_token;
        if(!refresh) throw new AuthenticationError("Failed to provide valid token.");
            
		const decryptedRefresh = decrypt(refresh);
        Auth.verifyRefresh(decryptedRefresh);

        const valid = await userService.validatePassword(user, password);
        if(!valid) throw new AppError("Invalid credentials. Please try again.", 401);

        await userService.deleteUser(user);
            
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");

         return res.status(200).json({ message: "User deleted" });
    });

	export const currUser = catchAsync(async(req,res) => {
        const id = req.user;
        if(!id) throw new AppError("Failed to provide user id.", 400);
        const user = await userService.getUserById(id);  
        if(!user) throw new AppError("User not found.", 404);		
        return res.status(200).json({ user });
	});

	export const passwordReset = catchAsync(async(req,res) => {
		const { newPassword, token } = req.body;
		if(!token) res.redirect(302, `${process.env.FRONTEND_URL}/404`);
		if(!newPassword) throw new AppError("Missing field. Please fill all provided fields.", 400);
		
		const decode = Auth.verifyEmail(token);
		await userService.updatePassword(decode.id, newPassword);	

		return res.status(200).json({ message: "Reset was successful" })
	})
    


