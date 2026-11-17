import { About } from "./about.tsx"
import { Features } from "./features.tsx"
import { Goal } from "./goal.tsx"
import { DropDown } from "./dropdown.tsx"
import { Card } from "./card.tsx";
import { features, about, goal } from "../../utils/nav.tsx";
import { ChevronDown } from "lucide-react";


export function Nav({ showDrop, setShow, openAuth }:any){

	const items = [ 
		"Features",
		"About",
		"Goal",
	];	

	const createCards = (arr:any) => {
		return(
			<>
				{ arr.map((val:any) => (
					<Card 
						img={val.img}
						para={val.para}
					/>
				)) }
			</>
		)
	}

	const featureCards = createCards(features); 
	const aboutCards = createCards(about); 
	const goalCards = createCards(goal); 


	const Comps:Record<string, any> = {
		"Features":
			<>
				<Features>
					{featureCards}
				</Features>
			</>,
		"About":
			<>
				<About>
					{aboutCards}
				</About>
			</>,
		"Goal":
			<>
				<Goal>
					{goalCards}
				</Goal>
			</>,
	};


	const ActiveComp = showDrop?.id ? Comps[showDrop.id] : null;

	return(
		<div className="nav">
			<div className="navLogo"></div>	
			<ul className="navList">
				{ items.map((key:string) => (
					<li 
						key={key} 
						onMouseEnter={() => setShow(key)} 
						onMouseLeave={() => setShow(key, false)}
						className="navListItem"
					>
						{key} <ChevronDown 
								className="navArrow" 
								size={14}
							/>
						{ showDrop?.open && showDrop?.id === key && ActiveComp && ( 
							<DropDown>
								<ActiveComp />
						   	</DropDown> 
						)}
					</li>
				))}
			</ul>
			<div className="navBtns">
				<button className="loginBtn" onClick={() => openAuth(true)}>Login</button>
			</div>	
		</div>
	)
}
