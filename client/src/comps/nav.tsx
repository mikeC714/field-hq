import { ChevronDown } from "lucide-react";

export function Nav({ openAuth }:any){
	return(
		<div className="nav">
			<div className="navLogo"></div>	
			<div className="navLinks">
				<ul className="navList">
					<li className="navListItem">Features <ChevronDown size={14}/></li>
					<li className="navListItem">About <ChevronDown size={14}/></li>
					<li className="navListItem">Goal <ChevronDown size={14}/></li>
				</ul>
			</div>	
			<div className="navBtns">
				<button className="loginBtn" onClick={() => openAuth(true)}>Login</button>
			</div>	
		</div>
	)
}
