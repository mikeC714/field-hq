import { useQuery } from "@tanstack/react-query";
import { url, apiFetch } from "../lib/lib.tsx";

export function useStats(){
	const { data, isLoading, isError } = useQuery({
		queryKey:["stats"],
		queryFn: async() => await apiFetch(url),

		// change this
		staleTime:Infinity,


		// look more into this
		gcTime:10,
	});

	const { quotes, monthlyTotal } = data;	

		

	return {
		stats:data,
		statLoading:isLoading,
		statError:isError
	}
}
