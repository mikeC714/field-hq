import { useState } from "react";
import { useSendQuote, useCreateQuote } from "../hooks/quote.tsx";
import { Form } from "../comps/quote/form.tsx";
import { Summary } from "../comps/quote/summary.tsx";

export function Quote(){
	const { sendQuote, sendLoading, sendError } = useSendQuote();
	const { createQuote, createLoading, createError } = useCreateQuote();
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
			/>
		</div>
	)
}
