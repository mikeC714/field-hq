import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from "../../utils/apiFetch.jsx";
import { Loader } from "lucide-react";
import config from "../config.js"

export function useCustomerTableHook({activeFilter= '', searchFilter = '', page = 1, limit = 2}){
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers', activeFilter, page, limit], 
        queryFn: async() => await apiFetch(`${config.SERVER}/api/all-customers?filter=${activeFilter}&page=${page}&limit=${limit}`),
        staleTime: 1000 * 60 * 10,
    })
    const filteredData = useMemo(() => {
        let result = data?.cusData ?? [];

       if (searchFilter.trim() !== '') {
            const search = searchFilter.toLowerCase().trim();
            result = result.filter((cus) =>{
                return(
                    cus.first_name?.toLowerCase().includes(search) ||
                    cus.last_name?.toLowerCase().includes(search) ||
                    cus.quote.some(qt => qt.job?.some(job => job.description?.toLowerCase().includes(search)),
				)
            )
        }
    );
}       return result;
}, [data, searchFilter]);
		
	if(isLoading) return <Loader />


    return {
		paginated: data?.paginated, 
        filteredData: filteredData || {},
        isLoading, 
        isError, 
        error 
    }
}

export function useCustomerDelete(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (quoteID) => apiFetch(`${config.SERVER}/api/delete-quote`, 'DELETE', quoteID),
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            queryClient.invalidateQueries({ queryKey: ['quickAccess'] })
        },
        onError: (err) => console.log(err.message)
	})
}

