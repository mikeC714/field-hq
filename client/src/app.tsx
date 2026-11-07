import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Auth } from "./pages/auth.tsx";
// import { Header } from "./comps/header.tsx";
// import { Dashboard } from "./pages/dashboard.tsx";
// import { Profile } from "./pages/profile.tsx";
// import { Notifications } from "./pages/notifications/notifications.tsx";
// import { Preview } from "./pages/notifications/preview.tsx";
// import { Quote } from "./pages/quote.tsx";


const queryClient = new QueryClient();
export function App() {
	return(
		<QueryClientProvider client={queryClient}>
			<Auth />
		</QueryClientProvider>
	) 
}

