import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './context/userContext.jsx'; 
import { AppRouter } from '../router/app.router.jsx'


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
