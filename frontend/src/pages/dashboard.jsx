import { useState } from 'react';
import { useAuth } from "../hooks/auth.hooks.jsx";
import { QuickAccess } from '../comps/dashboard/quickAccess.jsx';
import { useCustomerTableHook, useCustomerDelete } from '../hooks/customerTable.hooks.jsx';
import { CustomerTable } from '../comps/dashboard/customersTable.jsx'
import { NavBar, BurgerNav } from '../comps/navBar.jsx';

export function Dashboard(){
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [searchFilter, setSearchFilter] = useState('');
    const [page, setPage] = useState(1);
	const [open, setOpen] = useState(false);
    const { filteredData, paginated, isLoading, isError, error } = useCustomerTableHook({activeFilter, searchFilter, page});
    const [visible, setVisible] = useState(null); 
    const { logoutMutation } = useAuth();
    const { mutate, isPending: deletePending, isError: deleteError } = useCustomerDelete();
    const filters = ['ALL','DRAFT','SENT', 'PENDING', 'APPROVED', 'COMPLETED', 'UNPAID'];

    function handleSearchChange(e){
        setSearchFilter(e.target.value);
    }
    return(
        <div className='dashboardPage'>
			<header className="dashboardHeader">
				<BurgerNav 
					logout={logoutMutation}
					setOpen={setOpen}
					open={open}
				/>
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


