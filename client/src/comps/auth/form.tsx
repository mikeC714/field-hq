import { Google } from "../../assets/google.tsx";
import { X } from "lucide-react";
import type { AUTH_PAGE } from "../../types/auth/form.d.ts";

export function Form({ closeAuth, FORMS, auth, setAuth }:AUTH_PAGE){
	return(
		<div className="authContainer">
			<button className="authClose" onClick={() => closeAuth(true)}><X /></button>
			<div className="authBtns">
				<button 
					className={auth === "login" ? "authBtn login active" : "authBtn login" }
					onClick={() => setAuth("login")}
					disabled={auth === "login" ? true : false}
				>
					Login
				</button>
				<button 
					className={auth === "signup" ? "authBtn signup active" :"authBtn signup" }
					onClick={() => setAuth("signup")}
					disabled={auth === "signup" ? true : false}
				>
					Signup
				</button>
			</div>
			{ FORMS[auth] }
			{
				(auth === "login" || auth === "signup") && <button className="authGoogle"><Google /> Continue with Google</button> 
			}
		</div>
	);
}
