import { CornerDownLeft, CornerDownRight } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { AUTH_MODES } from "../../types/auth.d.ts";

type FORMS = Record<string, any>;
type PROPS = {
	FORMS:FORMS;
	auth:string;
	setAuth:Dispatch<SetStateAction<AUTH_MODES>>;
};


export function Form({ FORMS, auth, setAuth }:PROPS){

	function handleSwitch(){
		switch (auth){
			case "login": return setAuth("reset");
			case "signup": return setAuth("reset");
			case "reset": return setAuth("login");
		}
	};

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
			<button 
				className={auth === "reset" ? `authSwitch left` : `authSwitch right`}
				onClick={handleSwitch}
			>
				{auth === "signup" || auth === "login" ? "Forgot password "  : "Login to account"}
				{auth === "signup" || auth === "login" ? <CornerDownRight /> : <CornerDownLeft />}

			</button>
		</div>
	);
}
