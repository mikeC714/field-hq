import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/apiFetch.tsx";

export function useStats(){
	const { data, isLoading, isError } = useQuery({
		queryKey:["stats"],
		queryFn: async() => await apiFetch(url),
		staleTime:Infinity,
		gcTime:10,
	})

	return {
		stats:data,
		statLoading:isLoading,
		statError:isError
	}
}
