

type PROPS = {
	deleteAcc:any;
	loading:boolean;
	error:boolean;
};

export function Delete({ deleteAcc, loading, error }:PROPS){
	return(
		<div className="profileDelete">
			{error && (
				<div className="deleteError">
					<p>Failed to delete account, please try again.</p>
				</div>
			)}
			<div className="profileDeleteMsg">
				<h3>DELETING YOUR ACCOUNT IS PERMANENT</h3>	
				<p>YOUR DATA WILL BE UNRECOVERABLE, IF YOU'D LIKE TO PROCEED ENTER YOUR PASSWORD</p>	
			</div>
			<form className="profileDeleteForm" onSubmit={deleteAcc} >
				<input name="dPassword" type="password" required/>
				<button type="submit" disabled={loading}>DELETE ACCOUNT</button>
			</form>
		</div>
	)
};
