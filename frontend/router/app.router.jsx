import { Routes, Route, Navigate} from 'react-router-dom';
import { Dashboard } from '../src/pages/dashboard.jsx';
import { CreateQuote } from '../src/pages/createQuote.jsx';
import { ProfilePage } from '../src/pages/profile.jsx'
import { NotificationsPage } from '../src/pages/notification.jsx';
import { Authentication, ForgotPassword, ResetPassword } from '../src/pages/auth.jsx';
import { NotFound } from "../src/pages/notFound.jsx";
import { QuoteAcceptance } from "../src/pages/quoteAcceptance.jsx";

export function AppRouter(){
   return( 
        <Routes>
		   <Route path="*" element={<Navigate to="/404" replace />} />
            <Route path="/" element={<Navigate to="/auth" />} />
	   		<Route path="/404" element={<NotFound />} />
	   		<Route path='/quote/acceptance' element={<QuoteAcceptance /> } />
            <Route path="/auth" element={<Authentication />} /> 
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/create-quote' element={<CreateQuote />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/notifications' element={<NotificationsPage />}/>
	   		<Route path='/forgot-password' element={<ForgotPassword />}/>
	   		<Route path='/reset-password'element={<ResetPassword />}/>
        </Routes>
   )
}
