import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { apiFetch, apiFetchNoCreds } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useCreateQuote(){
  const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: async (data) => await apiFetch(`${config.SERVER}/api/create-quote`, 'POST', data),
            onError: () => {
				setTimeout(() => {
				}, 5000)
            },
            onSuccess:() => {
				setTimeout(() => {
					window.location.reload();
				}, 3000);
              	queryClient.invalidateQueries({ queryKey:['quickAccess'] });
				queryClient.invalidateQueries({ queryKey:['customers'] });
			}
    });

}

export function useAcceptQuote(){
	const [searchParams] = useSearchParams(); 
	const token = searchParams.get("token");
	const queryClient = useQueryClient();
	console.log("FIRED");
	console.log(token);

	const { mutate, isSuccess, isError } = useMutation({
		mutationFn: async () => await apiFetchNoCreds(`${config.SERVER}/api/quote/acceptance?token=${token}`, 'GET'),
		onSuccess:() => {
			queryClient.invalidateQueries({ queryKey: ['quickAccess'] });
			queryClient.invalidateQueries({ queryKey: ['customers'] });
		}
	})

	useEffect(() => {
		if(token) mutate(token);
	},[mutate,token])
	return { isSuccess, isError };
}
