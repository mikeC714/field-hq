import validator from "validator";

export function validateEmail(email){
	const ALLOWED_DOMAINS = ["gmail.com", "yahoo.com", "icloud.com", "hotmail.com", "outlook.com"];
	if(!email || !validator.isEmail(email)){
		return false;
	};
	const domain = email.split("@")[1].toLowerCase();
	if(!ALLOWED_DOMAINS.includes(domain)){
		return false;
	}
	return true;
}
