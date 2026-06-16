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
					<div className="qtAIconContainer">
						<X style={{strokeColor: 'red'}}/>		
					</div>
					<p className="qtAMsg">Failed to accept the quote please get in contact with the sender.</p>
				</div>
			}
		</div>
	)
}
