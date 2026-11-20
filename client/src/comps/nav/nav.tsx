import { About } from "./about.tsx"
import { Features } from "./features.tsx"
import { Goal } from "./goal.tsx"
import { DropDown } from "./dropdown.tsx"
import { Card } from "./card.tsx";
import { features, about, goal } from "../../utils/nav.tsx";
import { ChevronDown } from "lucide-react";


export function Nav({ hovered, showDrop, closeDrop, setShow, openAuth }:any){

	const NAV = ["Features", "About", "Goal"];	


	const DROP_DOWN_CONFIG:Record<string, any> = {
		Features: { wrapper: Features, items: features },
		About: { wrapper: About, items: about },
		Goal: { wrapper: Goal, items: goal },
	};


	const ACTIVE = hovered?.id ? DROP_DOWN_CONFIG[hovered?.id] : null;
	const ACTIVE_WRAPPER = ACTIVE?.wrapper;


	return(
		<div className="nav">
			<div className="navLogo"></div>	
			<ul className="navList">
				{ NAV.map((key:string) => (
					<li 
						key={key} 
						onMouseEnter={() => (
							setShow(key)
						)} 
						onMouseLeave={() => setShow(null, false)}
						className="navListItem"
					>
						{key} <ChevronDown 
								className="navArrow" 
								size={14}
							/>
						{showDrop && hovered?.id === key && ACTIVE_WRAPPER && (
							<DropDown>
								<ACTIVE_WRAPPER>
									{ACTIVE.items.map((val:any, i:number) => (
										<Card 
											key={i}
											img={val.img}
											para={val.para}
										/>
									))}
								</ACTIVE_WRAPPER>
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
