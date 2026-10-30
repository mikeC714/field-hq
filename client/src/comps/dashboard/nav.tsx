import type { Dispatch, SetStateAction } from "react";


type PROPS = { 
	activeStatus:string;
	setActiveStatus:Dispatch<SetStateAction<string>>;
};

type CELL_PROPS = {
	status:string;
	activeStatus:string;
	setActiveStatus:Dispatch<SetStateAction<string>>;
}

function NavCell({ status, activeStatus, setActiveStatus }:CELL_PROPS){
	return(
		<button 
			className={`navCell ${status}`}
			style={{ 
				borderColor: activeStatus === status ? "white" : "grey", 
				color: activeStatus === status ? "white" : "grey"
			}}
			onClick={() => setActiveStatus(status)}
			disabled={status === activeStatus}
		>
			<p>{status}</p>
		</button>
	)
};

export function Nav({ activeStatus, setActiveStatus }:PROPS){
	const status = [
		"ALL",
		"DRAFT",
		"PENDING",
		"APPROVED",
		"COMPLETE",
		"UNPAID",
	];
	return(
		<div className="nav">
			<div className="navCellContainer">
				{ status.map((status:string) => { 
					return(
						<NavCell 
							key={status}
							status={status} 
							activeStatus={activeStatus}
							setActiveStatus={setActiveStatus}
						/>
					)
				})}	
			</div>

			<div className="navSearch">
				<input 
					className="navInput"
					placeholder={"Search..."}
				>
				</input>
			</div>
		</div>
	)
};
