import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth.hooks.jsx";
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { useCustomerTableHook, useCustomerDelete } from '../hooks/customerTable.hooks.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx'
import { NavBar } from '../comps/navBar.jsx';
import { Bell, LogOut, Menu, User, ClipboardPen } from "lucide-react"; 

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchFilter, setSearchFilter] = useState('');
    const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
    const { filteredData, paginated, isLoading, isError, error } = useCustomerTableHook({activeFilter, searchFilter, page});
    const [visible, setVisible] = useState(null); 
    const { logoutMutation } = useAuth();
    const navigate = useNavigate();
    const { mutate, isPending: deletePending, isError: deleteError } = useCustomerDelete();
    const filters = ['ALL','DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED', 'UNPAID'];

    function handleSearchChange(e){
        setSearchFilter(e.target.value);
    }
    return(
        <div className='dashboardPage'>
			<header className="dashboardHeader">
				<div className='burgerWrapper'>
					<button 
						className="burgerBtn"
						onClick={() => setOpen(prev => !prev)}>
						<Menu />
					</button>
				</div>
				{open && (
					<Hamburger> 
							<ul className='burgerUl'> 
								<li
									className="burgerProfile"
									onClick={() => navigate('/profile')}
								>
									<User size={20}/>
								</li> 
								<li 
									className="burgerAlerts"
									onClick={() => navigate('/alerts')}
								>
									<Bell size={20}/>	
								</li>
								<li 
									className='burgerCq'
									onClick={() => navigate('/create-quote')}
								>
									<ClipboardPen size={20} />
								</li>
								<li 
									onClick={() => logoutMutation.mutate()}
									className="hamburgerLogout"
								>
									<LogOut size={17} className='burgerLogout'/>	
								</li>
							</ul>
					</Hamburger>
				)}
				<NavBar />
			</header>
            <div className='dashboardBody'>
                <div className='quickAccessContainer'>
                    <QuickAccess />
                </div>
                <div className='filterRow'>
                  <div className='statusBtnsContainer'>
                        {filters.map(btns => (
                            <button 
                                className={`statusBtns ${activeFilter === btns ? 'active' : ''}`}
                                key={btns} 
                                onClick={() => {
                                    setActiveFilter(btns);
                                    setPage(1);
                                }}>
                                {btns}
                            </button>
                        ))}
                    </div>
                    <input 
                        className='searchInput' 
                        placeholder='Search jobs...' 
                        value={searchFilter}
                        onChange={handleSearchChange}
                    />
                </div>
                    <CustomerTable 
                        data={filteredData}
						isLoading={isLoading}
						isError={isError}
						error={error}
                        page={paginated}
                        currPage={page}
                        setPage={setPage}
                        handleDelete={mutate}
						deletePending={deletePending}
						deleteError={deleteError}
						visible={visible}
						setVisible={setVisible}
                    />
            </div>
        </div>
    )
}


function Hamburger({ children }){
	return(
		<div className='burgerContainer'>
			<nav className="burgerNav">{children}</nav>	
		</div>
	)
}
