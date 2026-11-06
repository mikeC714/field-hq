import { useQuery } from "@tanstack/react-query";
import { url, apiFetch } from "../lib/lib.tsx";

type DATA = {
	key:{
		value:string | number;
		footer:string;
	};
};

export function useStats(){
	const { data, isLoading, isError } = useQuery({
		queryKey:["stats"],
		queryFn: async() => await apiFetch(url),

		// change this
		staleTime:Infinity,


		// look more into this
		gcTime:10,
	});


	return {
		stats:data as DATA,
		statsLoading:isLoading,
		statsError:isError
	}
}
