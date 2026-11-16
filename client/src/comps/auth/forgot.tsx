import type { AUTH_FORM } from "../../types/auth/form.d.ts";


export function Forgot({ mutate, loading, error }:AUTH_FORM){
	return(
		<form className="authForgot" onSubmit={mutate}>
			<div className="authFormBody">
				<h3 className="authForgotHeader">Oops...</h3>
				<p className="authForgotPara1">Mistakes happen, in order to attempt to gain access of your account enter the email for the account to send  a reset link.</p>
				<p className="authForgotPara2">Once sent follow the instructions in order to regain access to your account.</p>
			</div>
			<div className="authForgotFooter">
				<input className="authForgotInput authInput" type="email" name="fEmail" placeholder="example@gmail.com"/>
				<button type="submit" className="authSubmit authForgotSubmit">Send Email</button>
			</div>
		</form>
	);
}
