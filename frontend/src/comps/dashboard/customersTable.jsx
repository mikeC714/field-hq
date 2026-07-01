import { calendarConfig } from '../../../config/calender.config.js';
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react"; import calendar from 'dayjs/plugin/calendar';
import dayjs from 'dayjs';

export function CustomerTable({ data, page, setPage, handleDelete, visible, setVisible }) {
    dayjs.extend(calendar);

    function QuoteStatus({ status }){
        switch(status){
            case 'SENT' :
                return <div className='quoteStatus sentStatusStyle'>SENT</div>
            case 'PENDING' :
                return <div className='quoteStatus pendingStatusStyle'>PENDING</div> 
            case 'APPROVED' :
                return <div className='quoteStatus approvedStatusStyle'>APPROVED</div>
            case 'COMPLETED' :
                return <div className='quoteStatus completedStatusStyle'>COMPLETED</div>
            case 'UNPAID' :
                return <div className='quoteStatus unpaidStatusStyle'>UNPAID</div>
            default:
                return <div className='quoteStatus draftStatusStyle'>DRAFT</div>
        
        }
    }

/*function showCustomerCard(customer, quote){
        return (
            <CustomerCard
                firstName={customer.first_name}
                lastName={customer.last_name}
                address={customer.address}
                total={quote.total}
                desc={quote.job[0].description}
                status={quote.status}
                createdAt={quote.createdAt}
            />
	)
    }*/

	function handleVisbility(id){
		setVisible(prev => (prev === id ? null : id));
		console.log("clicked");
	}

    return(
        <div className="customerTableContainer">
            <div className="customerTable">
                <div className="tableHead">
                    <div className="thLeft">
                        <p>JOB ID</p>
                        <p>CUSTOMER</p>
                    </div>
                    <div className="thRight">
                        <p>JOB TYPE</p>
                        <p>TOTAL</p>
                        <p>STATUS</p>
                        <p>UPDATED</p>
                    </div>
                </div>
                <div className="tableBody">
                    { data?.length > 0 ? 
                    data.map((customer, customerIndex) =>
                        [...customer.quote]
                            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                            .map(quote =>
                                <div 
									key={quote.id} 
									className="customerDataRow"
									onClick={() => handleVisbility(quote.id)}
								>
								{visible === quote.id && (<button 
										className='customerDeleteBtnMobile'
										onClick={() => {
											handleDelete(quote.id)
										}}
										>
											<Trash2 size={20} />
										</button>
								)}
									<button 
										className='customerDeleteBtn'
										onClick={() => {
											handleDelete(quote.id)
										}}	
									>
										<Trash2 size={20} />
									</button>
                                        <div className="trLeft">
											<div className="customerJobId">QT-{String(customerIndex + 1).padStart(3,0)}</div>
												<div className="customerNameNAdd">
													<span className='customerNameTxt'>{customer?.first_name}  {customer?.last_name}</span>
													<span className="customerAddressTxt">{customer?.address}</span>
												</div>
											</div>
										<div className="quoteJobDescriptionTxt">{quote?.job[0]?.description}</div>
									<div className='trRight'>
											<div className="quoteTotalTxt">${quote?.total.toLocaleString()}</div>
												<QuoteStatus status={quote?.status} />
											<div className="quoteCreatedAtTxt">{dayjs(quote?.created_at).calendar(null, calendarConfig)}</div>
										</div>
									</div>
                        )) :<p> No Customers.</p> }
                </div>
                <div className='pageBtnContainer'>
                    <button
                        disabled = {page?.prevPage ? false : true}
                        onClick={() => {
							console.log("PAGE MINUS 1")
							setPage(p => p -1)}}
                    >
                        <ArrowLeft size={18}/>
                    </button>
                    <button 
                        disabled = {page?.nextPage ? false : true }
                        onClick={() => {
							console.log("PAGE PLUS 1")
							setPage(p => p +1)}}
                    >
                        <ArrowRight size={18}/>
                    </button>
                </div>
            </div>
        </div>
    )
}


