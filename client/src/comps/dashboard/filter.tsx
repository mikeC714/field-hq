import type { Dispatch, SetStateAction } from "react";


type PROPS = { 
	status:Array<string>;
	statusFilter:string;
	setStatusFilter:Dispatch<SetStateAction<string>>;
	setSearch:Dispatch<SetStateAction<string>>;
};

type CELL_PROPS = {
	status:string;
	statusFilter:string;
	setStatusFilter:Dispatch<SetStateAction<string>>;
}

function FilterCell({ status, statusFilter, setStatusFilter }:CELL_PROPS){
	return(
		<button 
			className={`navCell ${status}`}
			style={{ 
				borderColor: statusFilter === status ? "white" : "grey", 
				color: statusFilter === status ? "white" : "grey"
			}}
			onClick={() => setStatusFilter(status)}
			disabled={status === statusFilter}
		>
			{status}
		</button>
	)
};

export function Filter({ status, setSearch, statusFilter, setStatusFilter }:PROPS){
	return(
		<div className="nav">
			<div className="navCellContainer">
				{ status.map((str:string) => { 
					return(
						<FilterCell
							key={str}
							status={str} 
							statusFilter={statusFilter}
							setStatusFilter={setStatusFilter}
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
