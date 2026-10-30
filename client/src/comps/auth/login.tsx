import type { SubmitEventHandler } from "react";


type PROPS = {
	login:SubmitEventHandler<HTMLFormElement>
};

export function Login({ login }:PROPS){
	return(
		<form className="authForm" onSubmit={login}>
			<h3 className="authHeader">Login</h3>
				<div className="authFormBody">
					<div className="authFormInputs">
						<input className="authEmail" type="email" name="lEmail"  placeholder="example@gmail.com"/>
						<input className="authPassword" type="password" name="lPassword"  placeholder="supersecretpassword"/>
					</div>
				</div>
			<button type="submit" className="authSubmit">Login</button>
		</form>
	);
}
