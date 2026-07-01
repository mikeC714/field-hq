import { Check, X } from "lucide-react";
import { useAcceptQuote } from "../hooks/quote.hooks.jsx";

export function QuoteAcceptance(){
	const { isSuccess, isError } = useAcceptQuote();

	return (
		<div className="qtAPage">
			{isSuccess && 
				<div className="qtAMsgContainer">
					<div className="qtAIconContainer">
						<Check style={{strokeColor: 'green'}}/>
					</div>	
					<p className="qtAMsg">Thank you for accepting the quote.</p>
				</div>		
			}
			{isError && 
				<div className="qtAMsgContainer">
						<div className="frownFaceContainer">
							<div className="frownFaceEyes">
								<div className="eye1"></div>
								<div className="eye2"></div>
							</div>
							<div className="frownFaceMouth"></div>
						</div>
					<p className="qtAMsg">Failed to accept the quote please get in contact with the sender.</p>
				</div>
			}
		</div>
	)
}
