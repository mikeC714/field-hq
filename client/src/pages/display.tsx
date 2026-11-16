import { useState, useEffect } from "react";
import { Nav } from "../comps/nav.tsx";
import { Auth } from "./auth.tsx";



export function Display(){
	const [openAuth, setOpenAuth] = useState<boolean>(false);

	
	return(
		<div className="display">
			{ openAuth && (
				<Auth closeAuth={setOpenAuth} />
			)}	

			<Nav openAuth={openAuth} />
		</div>
	)
	
}
