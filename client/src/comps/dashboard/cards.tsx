
type PROPS = {
	title:string;
	data:string | number;
	footer:string;
	loading:boolean;
	error:boolean;
}

export function Card({ title, data, footer, loading, error }:PROPS){
	return(
		<div className="card">
			<div className="cardContent">
				<h3 className="cardHeader">{ title }</h3>
				<h1 className="cardData">{ data }</h1>
				<h3 className="cardFooter">{ footer }</h3>
			</div>	
		</div>
	)	
};
