import type { Dispatch, SetStateAction } from "react";



type PROPS = {
	price:{
		subTotal:string;
		total:string;
		markup:string;
	};
	setPrice:Dispatch<SetStateAction<
	{
		subTotal:string;
		total:string;
		markup:string;
	}>>;
	sendQuote:any;
};


export function Summary({ price, setPrice, sendQuote }:PROPS){
	return(
		<div className="quoteSummary">
			<header className="quoteSummaryHeader">Summary</header>
			<div className="quoteSummaryContent">
				<div className="quoteSubHeader">Subtotal</div>
				<div className="quoteSubtotal">{price.subTotal}</div>
				<div className="quoteSubHeader">Markup</div> 
				<input 
					className="quoteMarkup" 
					placeholder="0 %" 
					onChange={(e:any) => { 
						e.preventDefault(); 
						setPrice((prev:any) => prev.markup = e.target.value);
					}}
				/> 
				<div className="quoteSubHeader">Total</div> 
				<div className="quoteTotal">{Number(price.subTotal) * Number(price.markup)}</div>
				<button className="quoteSendBtn" onClick={sendQuote}>SEND QUOTE</button>
			</div>
		</div>
	)
};
