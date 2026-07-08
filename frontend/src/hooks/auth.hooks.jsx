import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch, apiFetchNoCreds } from '../../utils/apiFetch.jsx';
import config from "../config.js"

export function useAuth() {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); 
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
    
	const loginMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`${config.SERVER}/api/auth/login`, 'POST', credentials),
        onSuccess: ({ user }) => {
            queryClient.setQueryData(["user"], user);
            navigate("/dashboard")
        },
        onError: (err) => {
            throw new Error("Login Failed.", err.message);
        }
    });

    const signupMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`${config.SERVER}/api/auth/signup`, 'POST', credentials),
        onSuccess: ({ user }) => {
            queryClient.setQueryData(["user"], user);
            navigate("/dashboard")
        },
        onError: (err) => {
            throw new Error("Failed to signup.", err.message);
        }
    });

    const logoutMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`${config.SERVER}/api/auth/logout`, 'POST', credentials),
        onSuccess: () => {
            navigate("/auth");
        },
        onError: (err) => {
            throw new Error("Logout failed", err.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (credentials) => apiFetch(`${config.SERVER}/api/auth/delete`, `DELETE`, credentials),
        onSuccess: () => navigate("/auth"),
        
    })

	const resetPasswordPatch = useMutation({
		mutationFn: (password) => apiFetchNoCreds(`${config.SERVER}/api/auth/reset-password`, 'PATCH', { token, password }),
		onSuccess:(() => console.log("GOOD JOB"))
	})
	
	const resetPasswordGet = useQuery({
		queryKey:['resetPassword', token],
		queryFn: async() => apiFetchNoCreds(`${config.SERVER}/api/auth/reset-password?token=${token}`, 'GET'),
		enabled: !!token,
		retry:false
	})

	const sendResetPassword = useMutation({
		mutationFn: async (email) => await apiFetch(`${config.SERVER}/api/auth/forgot-password`, 'POST', { email }),
		onSuccess: () => {
			setTimeout(() => {
				navigate("/auth")
			}, 2000)
		}
	})
	    return { loginMutation, signupMutation, logoutMutation, resetPasswordGet, resetPasswordPatch, sendResetPassword, deleteMutation };
}





