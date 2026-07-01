import { useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from "../../utils/apiFetch.jsx";
import { useMediaQuery } from "../../utils/mediaQuery.jsx";
import { Loader } from "lucide-react";
import config from "../config.js"

export function useCustomerTableHook({activeFilter= '', searchFilter = '', page = 1}){
	const queryClient = useQueryClient();
	let limit = 16;
	const desktop = useMediaQuery('(max-width:1024px)');
	const tablet = useMediaQuery('(max-width:820px)');
	const lMobile = useMediaQuery('(max-width:500px) and (min-width:401px)');
	const mMobile = useMediaQuery('(max-width:400px)');
	const sMobile = useMediaQuery('(max-width:375px) and (min-width:360px)');

	if(desktop) limit = 11;
	if(tablet) limit = 8;
	if(lMobile) limit = 3;
	if(mMobile) limit = 3
	if(sMobile) limit = 2;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['customers', activeFilter, page, limit], 
        queryFn: async() => await apiFetch(`${config.SERVER}/api/customers?filter=${activeFilter}&page=${page}&limit=${limit}`),
        staleTime: 1000 * 60 * 10,
		retry:0
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
		
	useEffect(() => {
		queryClient.prefetchQuery({
			queryKey:['customers', activeFilter, page + 1, limit],
			queryFn: async() => await apiFetch(`${config.SERVER}/api/customers?filter=${activeFilter}&page=${page + 1}&limit=${limit}`),
			retry:0
		});
	},[data, page, limit, activeFilter, queryClient])

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
        mutationFn: (quoteId) => apiFetch(`${config.SERVER}/api/quote/delete`, 'DELETE', {quoteId}),
        onSuccess:() => {
            queryClient.invalidateQueries({ queryKey: ['customers'] })
            queryClient.invalidateQueries({ queryKey: ['quickAccess'] })
        },
        onError: (err) => console.log(err.message)
	})
}

