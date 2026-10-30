import type { SubmitEventHandler } from "react";


type PROPS = {
	signup:SubmitEventHandler<HTMLFormElement>
};

export function Signup({ signup }:PROPS){
	return(
		<form className="authForm" onSubmit={signup}>
			<h3 className="authHeader">Sign up</h3>
				<div className="authFormBody">
					<div className="authFormInputs">
						<input className="authFirst" type="text" name="sFirst" placeholder="First Name"/>
						<input className="authLast" type="text" name="sLast" placeholder="Last Name"/>
						<input className="authEmail" type="email" name="sEmail" placeholder=" example@gmail.com"/>
						<input className="authPassword" type="password" name="sPassword" placeholder="superdupersecret"/>
					</div>
				</div>
			<button type="submit" className="authSubmit">Create Account</button>
		</form>
	);
}
