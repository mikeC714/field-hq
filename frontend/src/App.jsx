import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/userContext.jsx'; 
import { AppRouter } from '../router/app.router.jsx'
import { Authentication } from './pages/auth.jsx';
import { apiFetch } from '../utils/apiFetch.jsx';


const queryClient = new QueryClient();

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </UserProvider>
        </QueryClientProvider>
    );
}