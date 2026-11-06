import type { ReactElement } from "react";

type PROPS = {
	logout:ReactElement<any>;
};

export function Header({ logout }:PROPS){
	return(
		<div className="header">
			{ logout }
		</div>
	)
}
