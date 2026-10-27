import { useState, useMemo, useEffect } from "react";
import { Header } from "../comps/header.tsx";
import { Card } from "../comps/dashboard/cards.tsx";
import { Nav } from "../comps/dashboard/nav.tsx";
import { Table } from "../comps/dashboard/table.tsx";
import { useCustomers } from "../hooks/customer.tsx";
import { useStats } from "../hooks/stats.tsx";


export function Dashboard(){
	const [activeStatus, setActiveStatus] = useState<string>("ALL");
	const { customers, customersLoading, customerError } = useCustomers();
	const { stats, statsLoading, statsError } = useStats();


	return(
		<div className="dashboard">
			<header className="dashboardHeader"> <Header />	</header>
			
			<div className="cardContainer">
			</div>

			<div className="navContainer">
				<Nav
					activeStatus={activeStatus}
					setActiveStatus={setActiveStatus}
				/>
			</div>

			<div className="tableContainer">
				<Table
					customers={customers}
				/>	
			</div>
		</div>
	)
};
