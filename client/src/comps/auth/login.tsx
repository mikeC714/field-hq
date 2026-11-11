import { CornerDownLeft, CornerDownRight } from "lucide-react";
import type { AUTH_FORM } from "../../types/auth/form.d.ts";

export function Login({ auth, authSwitch, mutate, loading, error }:AUTH_FORM){
	return(
		<form className="authForm" onSubmit={mutate}>
				<div className="authFormBody">
					<div className="authFormInputs">
						<input className="authEmail authInput" type="email" name="lEmail"  placeholder="example@gmail.com"/>
						<input className="authPassword authInput" type="password" name="lPassword"  placeholder="supersecretpassword"/>
					</div>
					<button className="authSwitch" onClick={authSwitch}>
						{
							auth === "login" ?
							<> Forgot password { <CornerDownRight /> } </> :
							<> { <CornerDownLeft /> } Login to account </>
						}
					</button>
				</div>
			<button type="submit" className="authSubmit">Login</button>
		</form>
	);
}
