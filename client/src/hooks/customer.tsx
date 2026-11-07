import { useQuery } from "@tanstack/react-query";
import { apiFetch, url } from "../lib/lib.tsx";

type PROPS = {
	statusFilter:string;
	searchFilter:string;
};

export function useCustomers({ statusFilter, searchFilter }:PROPS){
	const { data, isLoading, isError } = useQuery({
		queryKey:["stats"],
		queryFn: async() => await apiFetch(`${url}`),

		//change this
		staleTime:Infinity,

		//look more into this
		gcTime:10,
	});

	return {
		customers:data,
	 	customersLoading:isLoading,
		customersError:isError
	}
};
