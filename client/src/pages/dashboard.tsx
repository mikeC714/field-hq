import { useState, useMemo, useEffect } from "react";
import { Card } from "../comps/dashboard/cards.tsx";
import { Filter } from "../comps/dashboard/filter.tsx";
import { Table } from "../comps/dashboard/table.tsx";
import { useStats } from "../hooks/stats.tsx";
import { useQuote } from "../hooks/quotes.tsx";


export function Dashboard(){
	const [statusFilter, setStatusFilter] = useState<string>("ALL");
	const [searchFilter, setSearchFilter] = useState<string>("");
	const { stats, statsLoading, statsError } = useStats();
	const { useFetchQuotes, useDeleteQuote } = useQuote();
	const { quotes, quotesLoading, quotesError } = useFetchQuotes({ statusFilter, searchFilter });
	const { deleteQuote, deleteLoading, deleteError } = useDeleteQuote();

	const STATUS = [
		"ALL",
		"DRAFT",
		"PENDING",
		"APPROVED",
		"COMPLETE",
		"UNPAID",
	];

	return(
		<div className="dashboard">
			
			<div className="cardContainer">
				{Object.entries(stats).map(([key, val]) => {
					return(
						<Card 
							key={key}
							loading={statsLoading}
							error={statsError}
							title={key}
							data={val?.value}
							footer={val?.footer}
						/>
					)	
				})}
			</div>

			<div className="filterContainer">
				<Filter
					status={STATUS}
					setSearch={setSearchFilter}
					statusFilter={statusFilter}
					setStatusFilter={setStatusFilter}
				/>
			</div>

			<div className="tableContainer">
				<Table
					quotes={quotes}
					loading={quotesLoading}
					error={quotesError}
					delete={deleteQuote}
					dLoading={deleteLoading}
					dError={deleteError}
				/>	
			</div>
		</div>
	)
};
