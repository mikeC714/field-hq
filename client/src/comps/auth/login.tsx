import type { AUTH_FORM } from "../../types/auth/form.d.ts";

export function Login({ authSwitch, mutate, loading, error }:AUTH_FORM){
	return(
		<form className="authForm" onSubmit={mutate}>
				<div className="authFormBody">
					<div className="authFormInputs">
						<input className="authEmail authInput" type="email" name="lEmail"  placeholder="example@gmail.com"/>
						<div className="authLoginPass">
							<button className="authSwitch" onClick={authSwitch}>Forgot password ?</button>
							<input className="authPassword authInput" type="password" name="lPassword"  placeholder="supersecretpassword"/>
						</div>
					</div>
				</div>
			<button type="submit" className="authSubmit">Login</button>
			<span className="authSplit">or</span>
		</form>
	);
}
