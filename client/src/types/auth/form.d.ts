import type { Dispatch, SetStateAction } from "react";
import type { SubmitEventHandler } from "react";

type AUTH_MODES = "login" | "signup" | "reset";

type AUTH_FORM = {
	auth:string;
	authSwitch:() => void;
	mutate:SubmitEventHandler<HTMLFormElement> | any;
	loading:boolean;
	error:boolean;
};

type AUTH_PAGE = {
	FORMS:Record<string, any>;
	auth:string;
	setAuth:Dispatch<SetStateAction<AUTH_MODES>>;
};

export { AUTH_MODES, AUTH_FORM, AUTH_PAGE };
