import { LogOut } from "lucide-react";

type PROPS = {
	logout:() => void;
	loading:boolean;
	error:boolean;
};

export function Logout({ logout, loading, error }:PROPS){
	return(
		<div className="logout">
			{error && (
				//present a container informing the user of a failed attempt to logout and invite them to try again 
				<div> </div>
			)}
			<button 
				className="logoutBtn" 
				onClick={logout}
				disabled={loading}
			>
				<LogOut />
			</button>
		</div>
	);
};
