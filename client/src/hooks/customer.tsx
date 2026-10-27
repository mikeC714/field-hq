import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/apiFetch.tsx";

export function useCustomers(){
	const { data, isLoading, isError } = useQuery({
		queryKey:["stats"],
		queryFn: async() => await apiFetch(url),
		staleTime:Infinity,
		gcTime:10,
	})

	return {
		customers:data,
		customerLoading:isLoading,
		customerError:isError
	}
};
