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
			signupError:isError,
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

	function useLogout(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async() => await apiFetch(`${url}/auth/logout`, "POST"),
		});
		return{
			logout:mutate,
			logoutLoading:isPending,
			logoutError:isError
		};
	};

	function useDelete(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(password:string) => await apiFetch(`${url}/auth/delete`, "POST", { password }),
		});
		return{
			deleteAcc:mutate,
			deleteAccLoading:isPending,
			deleteAccError:isError
		};
	};

	function useForgot(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(email:string) => await apiFetch(`${url}/auth/forgot`, "POST", { email }),
		});
		return{
			forgot:mutate,
			forgotLoading:isPending,
			forgotError:isError,
		};
	};

	return{
		useSignup,
		useLogin,
		useLogout,
		useDelete,
		useForgot
	};	
};

