type PROPS = {
	info:{
		user:{
			firstName:string;
			lastName:string;
			email:string;
			phone:string;
		};
		work:{
			department:string;
			workId:string;
			location:string;
		}
	}	
};


export function Information({ info }:PROPS){
	return(
		<div>
			<section className="profileSection1">
				<h3 className="profileInfoHeader">User Information</h3>
				<div className="profileContent">
					
				</div>
			</section>
			<section className="profileSection2">
				<h3 className="profileInfoHeader">Work Information</h3>
				<div className="profileContent">

				</div>
			</section>
		</div>
	)	
}
