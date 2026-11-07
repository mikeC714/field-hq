import { useState } from "react";
import { useAuth } from "../hooks/auth.tsx";
import { Form } from "../comps/auth/form.tsx";
import { Login } from "../comps/auth/login.tsx";
import { Signup } from "../comps/auth/signup.tsx";
import { Forgot } from "../comps/auth/forgot.tsx";
import type { AUTH_MODES } from "../types/auth.d.ts";


export function Auth(){
	console.log("AUTH IS RENDERED");
	const { useSignup, useLogin, useForgot } = useAuth();
	const { login, loginLoading, loginError } = useLogin();
	const { signup, signupLoading, signupError } = useSignup();
	const { forgot, forgotLoading, forgotError } = useForgot();
	const [authMode, setAuthMode] = useState<AUTH_MODES>("login");

	function handleSignup(e:Event | HTMLFormElement){
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		const firstName = data.get("sFirst") as string;
		const lastName = data.get("sLast") as string;
		const email = data.get("sEmail") as string;
		const password = data.get("sPassword") as string;

		if(firstName.length === 0 || lastName.length === 0 || email.length === 0) return;

		signup({
			firstName,
			lastName,
			email,
			password
		});	
	};

	function handleLogin(e:Event | HTMLFormElement){
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		const email = data.get("lEmail") as string;
		const password = data.get("lPassword") as string;

		if(email.length === 0 || password.length === 0) return;

		login({ email, password });	
	};

	function handleForgot(e:Event | HTMLFormElement){
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		const email = data.get("fEmail") as string;

		if(email.length === 0) return;

		forgot(email);
	};


	const FORMS = {
		signIn:<Login 
				login={handleLogin}
				loginLoading={loginLoading}
				loginError={loginError}
			/>,
		create:<Signup 
				signup={handleSignup}
				signupLoading={signupLoading}
				signupError={signupError}
			/>,
		reset:<Forgot 
				forgot={handleForgot}
				forgotLoading={forgotLoading}
				forgotError={forgotError}
			/>

	};

	return(
		<div className="auth">
			<Form 
				FORMS={FORMS}
				auth={authMode}
				setAuth={setAuthMode}
			/>	
		</div>
	)
};
