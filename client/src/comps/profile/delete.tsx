import type { SubmitEventHandler } from "react";


type PROPS = {
	deleteAccount:SubmitEventHandler<any>;
}

export function Delete({ deleteAccount }:PROPS){
	return(
		<div className="profileDelete">
			<div className="profileDeleteMsg">
				<h3>DELETING YOUR ACCOUNT IS PERMANENT</h3>	
				<p>YOUR DATA WILL BE UNRECOVERABLE, IF YOU'D LIKE TO PROCEED ENTER YOUR PASSWORD</p>	
			</div>
			<form className="profileDeleteForm" onSubmit={deleteAccount} >
				<input name="password" type="password" required/>
				<button type="submit">DELETE ACCOUNT</button>
			</form>
		</div>
	)
};
