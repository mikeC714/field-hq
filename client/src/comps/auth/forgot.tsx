import type { SubmitEventHandler } from "react";


type PROPS = {
	reset:SubmitEventHandler<HTMLFormElement>
};


export function Forgot({ reset }:PROPS){
	return(
		<form className="authForgot" onSubmit={reset}>
			<h3>Oops...</h3>
			<p>Mistakes happen, in order to attempt to gain access of your account enter the email for the account so a reset link can be emitted.</p>
			<p>Once sent follow the instructions in order to regain access to your account.</p>
			<input className="authReset" type="email" name="fEmail" placeholder="example@gmail.com"/>
		</form>
	);
}
