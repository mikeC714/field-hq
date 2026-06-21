import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useUserContext } from '../context/userContext.jsx';
import { useAuth } from '../hooks/auth.hooks.jsx'
import { Bell, LogOut} from 'lucide-react';
import logo from "../imgs/logo.svg";

export function NavBar(){
    const { logoutMutation } = useAuth();
    const { nameInitials } = useUserContext();
    const navigate = useNavigate();
    return(
        <nav className='dashboardNav'>
            <div className='navLeft'>
                <div 
                    className='navLogo' 
                    onClick={() => navigate('/dashboard')}
                >
                    <img className='navLogoIcon'src={logo}/>
                </div>
            </div>
            <div className='navRight'>
                <button 
                    className='createQuoteBtn'
                    onClick={() => navigate('/create-quote')}    
                >
                    + New Quote
                </button>
                <NavHoverPopUp content={
                    <div className='navPopUpActions'>
                            <button 
                                className='navPopBtns' 
                                onClick={() => navigate('/notifications')}
                            >
                                alerts
                            </button>
                        <button
                            onClick={() => logoutMutation.mutate()}
                            // disabled={logoutMutation.isPending}
                            className='navPopBtns'   
                        >
                            log out
                        </button>
                    </div>
                }>
                    <div 
                        className='profileContainer'
                        onClick={() => navigate('/profile')}    
                    >
                        <h3>
                            { nameInitials }
                        </h3>
                    </div>
                </NavHoverPopUp>
            </div>
        </nav>
    )
}

export function CqNavBar({ handleSaveQuote, handleStatusChange, statusValue }){
    const navigate = useNavigate()
    const options= [
        {label: 'Draft', value: 'DRAFT'},
        {label: 'Pending', value: 'PENDING'},
        {label: 'Approved', value: 'APPROVED'},
        {label: 'Completed', value: 'COMPLETED'}
    ]

    return(
        <nav className='createQuoteNav'>
            <div className='cqNavLeft'>
               <div 
                    className='navLogo' 
                    onClick={() => navigate('/dashboard')}
                >
                    <img className='navLogoIcon' src={logo}/>
                </div>
            </div>
            <div className='cqNavRight'>
                <select name="selectedQuoteStatus" className='quoteStatusSelect' value={statusValue} onChange={handleStatusChange}>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}    
                </select>
                {/* <button className='cqChangeOrderBtn'>+ Change Order</button> */}
                <button className='cqSendQuoteBtn' onClick={handleSaveQuote}>
                    Save Quote
                </button>
            </div>
        </nav>
    )
}

function NavHoverPopUp({children, content}){
    const [isVisible, setIsVisible] = useState(false);
    const timeOutRef = useRef(null);

    function mouseEnter(){
        clearTimeout(timeOutRef.current);
        setIsVisible(true)
    }
    
    function mouseLeave(){
        timeOutRef.current = setTimeout(() => {
            setIsVisible(false)
        }, 300)
    }

    return(
        <div 
        className='navPopUpContainer'
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        >
            { children }
            {isVisible && <div className='navPopUpContent'>{ content }</div>}
        </div>
    )
}
