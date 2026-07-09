import {  useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom"
import { apiFetch, apiFetchNoCreds } from "../../utils/apiFetch.jsx";
import config from "../config.js";

export function useCreateQuote(){
  const queryClient = useQueryClient();
  
    return useMutation({
        mutationFn: async (data) => await apiFetch(`${config.SERVER}/api/quote/create`, 'POST', data),
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

export function useSendQuote(){
	return useMutation({
		mutationFn: async (quote) => await apiFetch(`${config.SERVER}/api/quote/send`, "POST", quote),
		retry: false,
		onSuccess:(() => {
			setTimeout(() => {
				window.location.reload();
			}, 3000)
		}),
		onError: (() => {
			setTimeout(() => window.location.reload(), 5000);
		})
	});
}

export function useAcceptQuote(){
	const [searchParams] = useSearchParams(); 
	const token = searchParams.get("token");
	const queryClient = useQueryClient();

	const {
		isLoading,
		isSuccess, 
		isError 
	} = useQuery({
		queryKey:['quoteAccept', token],
		queryFn: async () => await apiFetchNoCreds(`${config.SERVER}/api/quote/acceptance?token=${token}`, 'GET'),
		enabled: !!token,
		retry:false
	})
	
	const {
		mutate,
		isPending: isAcceptPending,
		isSuccess: isAcceptSuccess,
		isError: isAcceptError
	} = useMutation({
		mutationFn: async() => await apiFetchNoCreds(`${config.SERVER}/api/quote/acceptance?token=${token}`, 'POST'),
		onSuccess:() => {
			queryClient.invalidateQueries({ queryKey: ['quickAccess'] });
			queryClient.invalidateQueries({ queryKey: ['customers'] });
		}
	})
	
	useEffect(() => {
		if(!isLoading && !isError && !isAcceptError && !isAcceptSuccess){
			mutate()	
		}
	},[isLoading, isAcceptPending, isAcceptPending, isAcceptSuccess, mutate, isAcceptError, isError])

	return { 
		mutate,
		isAcceptPending,
		isAcceptError,
		isAcceptSuccess,
		isSuccess, 
		isError 
	};
}

