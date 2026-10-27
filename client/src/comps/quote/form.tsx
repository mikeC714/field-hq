import type { Dispatch, SetStateAction } from "react";


type CUSTOMER = {
	firstName:string;
	lastName:string;
	email:string;
	phone:string;
	address:string;

};

type LABOR = {
};

type CUSTOMER = {
	firstName:string;
	lastName:string;
	email:string;
	phone:string;
	address:string;

};

type PROPS = {
	setCustomer:Dispatch<SetStateAction<CUSTOMER>>;
	setLabor:;
	setMaterials:;
}



export function Form(){
	return(
		<form>
			<CustomerForm />
			<LaborForm />
			<MaterialForm />
		</form>
	)
};


function CustomerForm(){
	return(
		<div> </div>
	)
}

function LaborForm(){
	return(
		<div> </div>
	)
}

function MaterialForm(){
	return(
		<div> </div>
	)
}
