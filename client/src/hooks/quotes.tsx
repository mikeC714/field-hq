import { useQuery, useMutation } from "@tanstack/react-query";
import { apiFetch, url } from "../lib/lib.tsx";
import type { QUERY_PROPS } from "../types/quote.d.ts";



export function useQuote(){

	function useFetchQuotes({ statusFilter, searchFilter }:QUERY_PROPS){
		const { data, isLoading, isError } = useQuery({
			queryKey:["stats"],
			queryFn: async() => await apiFetch(`${url}/quote?status=${statusFilter}&search=${searchFilter}`),

			//change this
			staleTime:Infinity,

			//look more into this
			gcTime:10,
		});

		return {
			quotes:data,
			quotesLoading:isLoading,
			quotesError:isError
		}
	};

	function useCreateQuote(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(quote:any) => await apiFetch(`${url}/quote/create`, "POST", quote)
		});
		return{
			create:mutate,
			createLoading:isPending,
			createError:isError
		};
	};

	function useSendQuote(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(quote:any) => await apiFetch(`${url}/quote/send`, "POST", quote), 
		})
		return {
			send:mutate,
			sendLoading:isPending,
			sendError:isError
		};
	};

	function useDeleteQuote(){
		const { mutate, isPending, isError } = useMutation({
			mutationFn: async(quoteId:string) => await apiFetch(`${url}/quote/delete/${quoteId}`, "DELETE"), 
		})
		return {
			deleteQuote:mutate,
			deleteLoading:isPending,
			deleteError:isError
		};
	};


	return{
		useFetchQuotes,
		useSendQuote,
		useDeleteQuote,
		useCreateQuote
	};
}
