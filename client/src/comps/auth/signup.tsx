import type { AUTH_FORM } from "../../types/auth/form.d.ts";

export function Signup({ mutate, loading, error }:AUTH_FORM){
	return(
		<form className="authForm" onSubmit={mutate}>
				<div className="authFormBody">
					<div className="authFormInputs">
						<div className="authNameInputs">
							<input className="authFirst authInput" type="text" name="sFirst" placeholder="First Name"/>
							<input className="authLast authInput" type="text" name="sLast" placeholder="Last Name"/>
						</div>
						<div className="authCredInputs">
							<input className="authEmail authInput" type="email" name="sEmail" placeholder=" example@gmail.com"/>
							<input className="authPassword authInput" type="password" name="sPassword" placeholder="superdupersecretpassword"/>
						</div>
					</div>
				</div>
			<button type="submit" className="authSubmit">Create Account</button>
			<span className="authSplit">or</span>
		</form>
	);
}
