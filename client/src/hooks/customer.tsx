import { useQuery } from "@tanstack/react-query";
import { apiFetch, url } from "../lib/lib.tsx";

export function useCustomers(){
	const { data, isLoading, isError } = useQuery({
		queryKey:["stats"],
		queryFn: async() => await apiFetch(url),

		//change this
		staleTime:Infinity,

		//look more into this
		gcTime:10,
	});

	return {
		customers:data,
		customerLoading:isLoading,
		customerError:isError
	}
};
