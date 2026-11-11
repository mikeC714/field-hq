import { CornerDownLeft, CornerDownRight } from "lucide-react";
import type { AUTH_FORM } from "../../types/auth/form.d.ts";

export function Signup({ auth, authSwitch, mutate, loading, error }:AUTH_FORM){
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
							<input className="authPassword authInput" type="password" name="sPassword" placeholder="superdupersecret"/>
						</div>
					</div>
					<button className="authSwitch" onClick={authSwitch}>
						{
							auth === "signup" ?
							<> Forgot password { <CornerDownRight /> } </> :
							<> { <CornerDownLeft /> } Login to account </>
						}
					</button>
				</div>
			<button type="submit" className="authSubmit">Create Account</button>
		</form>
	);
}
