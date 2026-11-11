import type { AUTH_PAGE } from "../../types/auth/form.d.ts";

export function Form({ FORMS, auth, setAuth }:AUTH_PAGE){
	return(
		<div className="authContainer">
			<div className="authBtns">
				<button 
					className="authBtn login" 
					onClick={() => setAuth("login")}
					disabled={auth === "login" ? true : false}
				>
					Login
				</button>
				<button 
					className="authBtn signup" 
					onClick={() => setAuth("signup")}
					disabled={auth === "signup" ? true : false}
				>
					Signup
				</button>
			</div>
			{ FORMS[auth] }
		</div>
	);
}
