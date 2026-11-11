import { CornerDownLeft, CornerDownRight } from "lucide-react";
import type { AUTH_FORM } from "../../types/auth/form.d.ts";


export function Forgot({ auth, authSwitch, mutate, loading, error }:AUTH_FORM){
	return(
		<form className="authForgot" onSubmit={mutate}>
			<div className="authFormBody">
				<h3>Oops...</h3>
				<p>Mistakes happen, in order to attempt to gain access of your account enter the email for the account so a reset link can be emitted.</p>
				<p>Once sent follow the instructions in order to regain access to your account.</p>
				<input className="authReset" type="email" name="fEmail" placeholder="example@gmail.com"/>
				<button className="authSwitch" onClick={authSwitch}>
					{
						auth === "login" ?
					<> Forgot password { <CornerDownRight /> } </> :
						<> { <CornerDownLeft /> } Login to account </>
					}
				</button>
			</div>
			<button type="submit" className="authSubmit">Send Email</button>
		</form>
	);
}
