export function Card({ img, para }:any){
	return(
		<div className="navCard">
			<div className="navImg">{img}</div>	
			<div className="navPara">{para}</div>	
		</div>
	)
}
