import { createContext, useContext, useMemo } from 'react';
import { apiFetch } from '../../utils/apiFetch';
import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";
import config from '../config.js';

const UserContext = createContext();


export function UserProvider({children}){
    const { data, isLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async() => {
            const res = await apiFetch(`${config.SERVER}/api/auth/me`, "GET")
			localStorage.setItem("user", JSON.stringify(res.user));
			return res;
		},
		initialData: () => {
			const cached = localStorage.getItem("user");
			return cached ? { user: JSON.parse(cached) } : undefined;
		},
    	retry: false,
		refetchOnMount: true,
		staleTime: 0,
		onError:() => {
			localStorage.removeItem("user");
		}
    });

    const firstName = data?.user?.first_name ?? "";
    const lastName = data?.user?.last_name ?? "";
    const email = data?.user?.email;
    const created_at = data?.user?.created_at;
    const userId = data?.user?.id;
   

    const value = useMemo(() => ({
		nameInitials: firstName && lastName ? `${firstName[0]}${lastName[0]}` : <User />,
        email,
        firstName,
        lastName,
        userId,
        created_at, 
        isLoading 
    }), [isLoading, created_at, email, firstName, lastName, userId])

    
    return(
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext(){
    return useContext(UserContext)
}
