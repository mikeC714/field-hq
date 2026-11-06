import { useState } from "react";
import { useQuote } from "../hooks/quotes.tsx";
import { Form } from "../comps/quote/form.tsx";
import { Summary } from "../comps/quote/summary.tsx";

export function Quote(){
	const { useSendQuote,useCreateQuote } = useQuote();
	const { send, sendLoading, sendError } = useSendQuote();
	const { create, createLoading, createError } = useCreateQuote();

	const [price, setPrice] = useState({
		subtotal:"",
		markup:"",
		total:""
	});

	const [customer, setCustomer] = useState({
		firstName:"",
		lastName:"",
		phone:"",
		email:"",
		address:"",
	});

	const [labor, setLabor] = useState([
		{
			description:"",
			hours:"",
			hourlyRate:""
		}
	]);

	const [materials, setMaterials] = useState([
		{
			description:"",
			quantity:"",
			total:""
		}
	]);

	const [markup, setMarkup] = useState("");
	const [status, setStatus] = useState("");

	

	return(
		<div className="quote">
			<Form />
			<Summary
				price={price}
				setPrice={setPrice}
				send={send}
				sendLoading={sendLoading}
				sendError={sendError}
			/>
		</div>
	)
}
