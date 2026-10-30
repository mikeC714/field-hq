import { useState } from "react";
import { useAuth } from "../hooks/auth.tsx";
import { Form } from "../comps/auth/form.tsx";
import { Login } from "../comps/auth/login.tsx";
import { Signup } from "../comps/auth/signup.tsx";
import { Forgot } from "../comps/auth/forgot.tsx";


export function Auth(){
	const { useSignup, useLogin } = useAuth();
	const { login, loginLoading, loginError } = useLogin();
	const { signup, signupLoading, signupError } = useSignup();
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

	const FORMS = {
		signIn:<Login 
				login={handleLogin as any}
				loginLoading={loginLoading}
				loginError={loginError}
			/>,
		create:<Signup 
				signup={handleSignup as any}
				signupLoading={signupLoading}
				signupError={signupError}
			/>,
		reset:<Forgot 
				forgot={handleForgot as any}
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
