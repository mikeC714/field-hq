import { useState } from "react";
import { Information } from "../comps/profile/information.tsx";
import { Delete } from "../comps/profile/delete.tsx";
import { useAuth } from "../hooks/auth.tsx";
// import { useLocalStorage } from "../hooks/local.tsx";
import type { DISPLAY } from "../types/display.d.ts";


export function Profile(){
	const [display, setDisplay] = useState<DISPLAY>("Information");
	const { useDelete } = useAuth();
	const { deleteAcc, deleteAccLoading, deleteAccError } = useDelete();
	const DISPLAYS:Record<string, any>  = {
		"Information":<Information />,
		"Delete":<Delete 
				deleteAcc={handleDelete}			
				loading={deleteAccLoading}
				error={deleteAccError}
			/>
	};
	const Current = DISPLAYS[display];

	function handleDelete(e:Event | HTMLFormElement){
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		const password = data.get("dPassword") as string;

		if(password.length === 0) return;

		deleteAcc(password);
	}

	return(
		<div className="profile">
			<ul>
				{Object.keys(DISPLAYS).map((key:string) => {
					const isActive = display && display === key;
					return(
						<li key={key} className="profileSetting">
							<button
								className="profileSettingBtn"
								onClick={() => setDisplay(key as DISPLAY)}
								disabled={display === key}
								style={{ borderBottom: isActive ? "1px solid rgba(255,255,255,1)" : "none", paddingBottom: isActive ? "4px" : "0", color:"black"}}
							>
								{key}
							</button>
						</li>
					)
				})}
			</ul>
			<div className="profileDisplay">
				<Current />
			</div>
		</div>
	)
};
