import { ArrowRight, ArrowLeft } from "lucide-react";

type PROPS = {
	quotes:Array<object>
	loading:boolean;
	error:boolean;
};

export function Table({ quotes, loading, error }:PROPS){
	const headerL = [ "ID", "CUSTOMER", "JOB" ];
	const headerR = [ "STATUS", "PRICE", "DATE" ];

	return(
		<div className="table">
			<header className="tableHeaders">
				<div className="tableHeaderL">
					{headerL.map((str:string) => (
						<p className="headerLP">{str}</p>
					))}
				</div>
				<div className="tableHeaderR">
					{headerR.map((str:string) => (
						<p className="headerRP">{str}</p>
					))}
				</div>
			</header>
			<div className="tableRow">
				{quotes.map((cus:any) => ( 
					<div className="rowContent">
						<div className="rowContentL">
							<div>
								<p>{cus.firstName}</p>
								<p>{cus.lastName}</p>
							</div>
							<div></div>
							<div></div>
						</div>
						<div className="rowContentR"></div>
					</div>
				))}
			</div>
			<div className="tableFooter">
				<div className="tableBtns">
					<button><ArrowRight /></button>
					<button><ArrowLeft /></button>
				</div>
			</div>
		</div>
	)
}
