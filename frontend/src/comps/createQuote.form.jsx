import { X } from 'lucide-react';

export function CreateQuoteForm({ handleCustomerForm, handleMaterialForm, handleLaborForm, customerInfo, labor, materials, laborInputs, materialInputs, removeLaborBtn, removeMatBtn}) {

    return(
        <div className='cqFormWrapper'>

            <form className='cqCustomerCard'>
                <p className='cqCardLabel'>CUSTOMER</p>
                <div className='cqCustomerFields'>
                    <div className="cqCustomerNames"> 
                        <input 
                            className='cqInput cqInputWide' 
                            value={customerInfo.firstName} 
                            onChange={(e) => handleCustomerForm(e)} 
                            name='firstName' 
                            type="text" 
                            placeholder='First Name' 
                        />
                        <input 
                            className='cqInput cqInputWide' 
                            value={customerInfo.lastName} 
                            onChange={(e) => handleCustomerForm(e)} 
                            name='lastName' 
                            type="text" 
                            placeholder='Last Name' 
                        />
                    </div>
                    <div className='cqCustomerContact'>
                        <input 
                            className='cqInput' 
                            value={customerInfo.email} 
                            onChange={(e) => handleCustomerForm(e)} 
                            name='email' 
                            type="text" 
                            placeholder='Email' 
                        />
                        <input 
                            className='cqInput' 
                            value={customerInfo.phone} 
                            onChange={(e) => handleCustomerForm(e)} 
                            name='phone' 
                            type="text" 
                            placeholder='Phone' 
                        />
                    </div>
                    <input 
                        className='cqInput cqInputWide' 
                        value={customerInfo.address} 
                        onChange={(e) => handleCustomerForm(e)} 
                        name='address' 
                        type="text" 
                        placeholder='Address' 
                    />
                </div>
            </form>

            <div className='cqSection'>
                <div className='cqSectionHeader'>
                    <span className='cqSectionLabel'>MATERIALS</span>
                    <button className='cqAddBtn' onClick={materialInputs}>+ Add</button>
                </div>
                <div className='cqTable'>
                    <div className='cqTableHeader'>
                        <span className='cqColDesc'>Description</span>
						<div className='cqColSmallContainer'>
							<span className='cqColSmallTitle cqColSmallQty'>Qty</span>
							<span className='cqColSmallTitle cqColSmallUnit'>Unit $</span>
							<span className='cqColSmallTitle cqColSmallTotal'>Total</span>
						</div>
                    </div>
                    {materials.map((mats, matIndex) =>
                        <form key={mats.id} className='cqTableRow'>
                            <input 
                                className='cqInput cqColDesc'
                                name='description' 
                                type="text" 
                                placeholder='Description'
                                value={mats.description} 
                                onChange={(e) => handleMaterialForm(e, matIndex)}
                            />
                            <div className="cqSmallContainer">
                                <input 
                                    className='cqInput cqColSmall'
                                    name='quantity' 
                                    type="number" 
                                    placeholder='0'
                                    value={mats.quantity} 
                                    onChange={(e) => handleMaterialForm(e, matIndex)} 
                                />
                                <input 
                                    className='cqInput cqColSmall'
                                    name='unitCost' 
                                    type='number'
                                    placeholder='0'
                                    value={mats.unitCost} 
                                    onChange={(e) => handleMaterialForm(e, matIndex)} 
                                />
                                <p className='cqColSmall cqColSmallTotal'>${mats.total}</p>
                            </div>
                            <button onClick={() => removeMatBtn(mats.id)}><X size={'16px'}/></button>
                        </form>
                    )}
                </div>
            </div>

            <div className='cqSection'>
                <div className='cqSectionHeader'>
                    <span className='cqSectionLabel'>LABOR</span>
                    <button className='cqAddBtn' onClick={laborInputs}>+ Add</button>
                </div>
                <div className='cqTable'>
                    <div className='cqTableHeader'>
                        <span className='cqColDesc'>Description</span>
					<div className='cqColSmallContainer'>
                        <span className='cqColSmall cqColSmallHrs'>Hrs</span>
                        <span className='cqColSmall cqColSmallRate'>Rate</span>
                        <span className='cqColSmall cqColSmallTotal'>Total</span>
					</div>
                    </div>
                    {labor.map((lab,labIndex) =>
                        <form key={lab.id} className='cqTableRow'>
                            <input 
                                className='cqInput cqColDesc'
                                name='description' 
                                type="text" 
                                placeholder='Description'
                                value={lab.description} 
                                onChange={(e) => handleLaborForm(e, labIndex)} 
                            />
						<div className='cqSmallContainer'>
                            <input className='cqInput cqColSmall'
                                name='hours' 
                                type="number"
                                placeholder='0'
                                value={lab.hours} 
                                onChange={(e) => handleLaborForm(e, labIndex)} 
                            />
                            <input className='cqInput cqColSmall'
                                name='hourlyRate' 
                                type="number"
                                placeholder='0'
                                value={lab.hourlyRate} 
                                onChange={(e) => handleLaborForm(e, labIndex)} 
                            />
                            <p className='cqColSmall cqColSmallTotal'>${lab.total}</p>
						</div>
                            <button onClick={() => removeLaborBtn(lab.id)}><X size={'16px'}/></button>
                        </form>
                    )}
                </div>
            </div>

        </div>
    )

}
