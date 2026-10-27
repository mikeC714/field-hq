type PROPS = {
	customers:Array<object>
};

export function Table({ customers }:PROPS){
	const headerR = [
		"ID",
		"CUSTOMER",
		"JOB"
	]
	const headerL = [
		"STATUS",
		"PRICE",
		"DATE"
	]

	return(
		<div className="table">
			<header className="tableHeaders">
				<div className="tableHeaderL"></div>
				<div className="tableHeaderR"></div>
			</header>

			<div className="tableRow">
				{customers.map((cus:object) => {
					return(
						<div className="rowContent">
							<div className="rowContentL"></div>
							<div className="rowContentR"></div>
						</div>
					)
				})}
			</div>

			<div className="tableFooter"></div>
		</div>
	)
}
