import { useMutation } from "@tanstack/react-query";
import { url, apiFetch } from "../lib/lib.tsx";
import type { NEW_USER, USER } from "../types/user.d.ts";


export function useAuth(){

	function useSignup(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(user:NEW_USER) => await apiFetch(`${url}/auth/signup`, "POST", user),
		});
		return{
			signup:mutate,
			signupLoading:isPending,
			signError:isError,
		}
	};

	function useLogin(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(user:USER) => await apiFetch(`${url}/auth/login`, "POST", user),
		});
		return{
			login:mutate,
			loginLoading:isPending,
			loginError:isError,
		}
	};

	return{
		useSignup,
		useLogin
	};	
};

