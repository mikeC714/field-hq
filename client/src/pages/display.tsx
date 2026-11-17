import { useState, useCallback, useEffect, memo } from "react";
import { Nav } from "../comps/nav/nav.tsx";
import { Auth } from "./auth.tsx";
import { useUnmount } from "../hooks/unmount.tsx";



export function Display(){
	const [openAuth, setOpenAuth] = useState<boolean>(false);
	const [hovered, setHovered] = useState<{id:string | null, open:boolean}>({ id:null, open:false });
	

	const showDrop = useUnmount(hovered.open, 200);
	
	const dropDown = useCallback((id:string, open:boolean = true) => {
		setHovered((prev:any) => { 
			if(!open && prev?.id === id) return prev;

			return { id, open };
		})
	},[]);

	const MemoNav = memo(Nav); 


	return(
		<div className="display">
			{ openAuth && (
				<Auth closeAuth={setOpenAuth} />
			)}	

			<MemoNav 
				showDrop={showDrop}
				setShow={dropDown}
				openAuth={openAuth} 
			/>
		</div>
	)
	
}
