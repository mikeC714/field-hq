import { useState, useRef } from 'react';
import { useSendQuote, useCreateQuote } from "../hooks/quote.hooks.jsx";
import { CreateQuoteForm } from '../comps/createQuote.form.jsx';
import { CqNavBar } from '../comps/navBar.jsx'
import { useUserContext } from '../context/userContext.jsx';
import { Send, Loader, Check } from 'lucide-react';

export function CreateQuote(){
	const idRef = useRef(0);
	const {mutate:sendEmail, isSuccess: emailSuccess, isPending: isSendingEmail, isError: emailErr} = useSendQuote();
	const user = useUserContext();
	const {mutate, isSuccess, isPending, isError} = useCreateQuote();
    const [userMarkup, setUserMarkup] = useState("");

	const [materials, setMaterials] = useState([
        {
            description: "",
            quantity: "",
            unitCost: "",
            total: 0
        }
    ]);
    const [labor, setLabor] = useState([
        {
            description: "",
            hours: "",
            hourlyRate: "",
            total: 0
        }
    ]);
    const [customerInfo, setCustomerInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
    });
    const [status, setStatus] = useState('DRAFT');

	function handleStatusChange(e){
		setStatus(e.target.value);
	}

    async function handleSendQuote() {
		for(const [_, val] of Object.entries(customerInfo)){
			if(!val.trim()) throw new Error("Missing Customer Input. Please fill all input fields.");
		}
			sendEmail({
				user,
				customer: customerInfo,
				quote: { 
					status: "SENT", 
					markup: Number(userMarkup), 
					total: Number(total.toFixed(2)),
					subTotal: Number(total - (total * (userMarkup / 100)))
				},
				labor: labor.map(l => ({
					...l, hours: Number(l.hours), 
					hourlyRate: Number(l.hourlyRate) 
				})),
				materials: materials.map(m => ({ 
					...m, 
					quantity: Number(m.quantity), 
					unitCost: Number(m.unitCost) }))
			});
    }


    function handleSaveQuote() {
		for(const [_, val] of Object.entries(customerInfo)){
			if(!val.trim()) throw new Error("Missing Customer Input. Please fill all input fields.");
		}
		mutate({
			customer: customerInfo,
			quote: { status: status ,markup: Number(userMarkup), total: Number(total.toFixed(2)) },
			labor: labor.map(l => ({
				...l,
				hours: Number(l.hours),
				hourlyRate: Number(l.hourlyRate)
			})),
			materials: materials.map(m => ({
				...m,
				quantity: Number(m.quantity),
				unitCost: Number(m.unitCost)
			})),
		})
    } 

	  function handleCustomerForm(e) {
		const { name, value } = e.target
		setCustomerInfo(prev => ({
			...prev,
			[name]: value
		}))
	  }

    function handleMaterialForm(e, index) {
        const { name, value} = e.target
            setMaterials((prevMaterials) => 
                prevMaterials.map((mats, i) => {
                    if(i === index){
                    const updated = { ...mats, [name]: value }
                        return { ...updated, total: Number(updated.unitCost) * Number(updated.quantity) }
                    }
                    return mats
                }
            )
        )
    }

  function handleLaborForm(e, index) {
        const { name, value } = e.target;
            setLabor((prevLabor) =>
                prevLabor.map((lab, i) =>{
                    if(i === index){
                        const updated = { ...lab, [name]: value }
                        return { ...updated, total: Number(updated.hours) * Number(updated.hourlyRate) }
                    }
                    return lab
                }
            )
        )
    }

    const subTotal = [
        ...materials.map(mats => mats.total),
        ...labor.map(lab => lab.total),
    ].reduce((sum, val) => sum += val, 0);

    const total = subTotal * ( 1 + userMarkup / 100)


    function handleAddMaterialInputs() {
        setMaterials(prev => 
            [...prev, { 
                id: idRef.current++ ,
                description: "", 
                quantity: "", 
                unitCost: "", 
                total: 0 
            }])
    }

    function handleAddLaborInputs() {
        setLabor(prev => 
            [...prev, {
                id: idRef.current++, 
                description: "", 
                hours: "", 
                hourlyRate: "", 
                total: 0 
            }])
    }

    function limitNum(val, limit){
        if(val.length > limit){
            return  val.substring(0, limit-3) + '...';
        }
        return val;
    }

    function removeLaborBtn(id){
        setLabor(labor.filter(inputs => inputs.id !== id));
    }

    function removeMatBtn(id){
        setMaterials(materials.filter(inputs => inputs.id !== id));
    }
    
    const markUpPerc = (userMarkup / 100 * subTotal).toLocaleString();

    const markUpDiff = limitNum(markUpPerc, 10)
    return (
        <div className='createQuotePage'>
			{emailSuccess && (
				<div className='overlay'>
					<div className='cqSuccessContainer'> 
						<Check className='cqCheck'/> 
						<p className='cqSuccess'>Quote Sent!</p>
					</div>
				</div>
			)}
            {isSendingEmail && (
                <div className='overlay'>
                    <Loader className='cqLoader'/>
                </div>
            )}
            {emailErr && (
                <div className='overlay'>
                    <p>Failed to send quote.</p>
                </div>
            )}
			{isSuccess &&(
				<div className='overlay'>
					<div className='cqSuccessContainer'>
						<Check className='cqCheck' />
						<p className='cqSuccess'>Quote Saved!</p>
					</div>
				</div>
			)}
			{isPending && (
				<div className='overlay'>
					<Loader className='cqLoader'/>
				</div>
			)}
		{isError && (
			<div className='overlay'>
				<p>Failed to create quote.</p>
			</div>
		)}
            <CqNavBar 
                handleSaveQuote={handleSaveQuote}
                handleStatusChange={handleStatusChange}
                statusValue={status}
            />
            <div className='createQuoteContent'>
                <div className='cqLeft'>
                    <CreateQuoteForm
                        handleCustomerForm={handleCustomerForm}
                        handleLaborForm={handleLaborForm}
                        handleMaterialForm={handleMaterialForm}
                        customerInfo={customerInfo}
                        labor={labor}
                        materials={materials}
                        materialInputs={handleAddMaterialInputs}
                        laborInputs={handleAddLaborInputs}
                        removeLaborBtn={removeLaborBtn}
                        removeMatBtn={removeMatBtn}
                    />
                </div>
                <div className='cqRight'>
                    <p className='cqSummaryTitle'>SUMMARY</p>
					<div className="cqCalc">
						<div className='cqSubtotalRow'>
							<span className='cqSummaryLabel'>Subtotal</span>
							<span className='cqSummaryValue'>${subTotal.toLocaleString()}</span>
						</div>
						<div className='cqMarkupContainer'>
							<span className='cqSummaryLabel'>Markup</span>
							<div className='cqMarkupRow'>
								<input
									className='cqMarkupInput'
									type='number'
									value={userMarkup}
									placeholder='0'
									onChange={(e) => setUserMarkup(e.target.value)}
								/>
								<span className='cqMarkupPct'>%</span>
								<span className='cqMarkupDifference'>${markUpDiff}</span>
							</div>
						</div>
					<div className='cqTotalRow'>
						<span className='cqTotalLabel'>Total</span>
						<span className='cqTotalValue'>${total.toFixed(2)}</span>
					</div>
					</div>
                    <button 
                        className='cqSendToCustomerBtn'
                        onClick={() => {
                            handleSendQuote()
                        }}>
                        SEND TO CUSTOMER <Send  size={14} />
                    </button>
                </div>

            </div>
        </div>
    )
}


