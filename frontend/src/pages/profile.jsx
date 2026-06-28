import { useState, useEffect } from 'react';
import { NavBar } from '../comps/navBar.jsx';
import { useQuickAccess } from '../hooks/quickAccess.hooks.jsx';
import { useNotiHook } from '../hooks/notifications.hooks.jsx';
import { useUserContext } from "../context/userContext.jsx";
import { useAuth } from '../hooks/auth.hooks.jsx'
import { HandCoins, Briefcase, BookCheck, Star, Check, Clock, PiggyBank, ChevronLeft, ChevronRight } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function Overview({ userConfig, setUserConfig, email, userId, isEditing }) {
	const user = JSON.parse(localStorage.getItem("user"));
    const date = user.created_at.split("T")[0];
    dayjs(date).format('MMMM D, YYYY')

	useEffect(() => {
        const saved = localStorage.getItem(`userConfig`);
        if(saved){
            const { phoneNumber, location, department, role } = JSON.parse(saved);
            setUserConfig({
                phoneNumber,
                location,
                department,
                role
            })
        }
    }, [setUserConfig, userId])

    return (
         <div className='profileOverviewCard'>
             <section className='profileInfoSection'>
                 <h4 className='profileSectionLabel'>Personal Information</h4>
                 <div className='profileInfoGrid'>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Full Name</span>
                         <span className='profileFieldValue'>{user.first_name} {user.last_name}</span>
                     </div>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Email Address</span>
                         <span className='profileFieldValue'>{email}</span>
                     </div>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Phone Number</span>
                         <span className='profileFieldValue'>
                             {isEditing ? (
                               <input
                                 style={{ background: "none", border: "none", color: "white", outline:"none", fontSize: "14px"}}
                                 value={userConfig.phoneNumber || ""}
                                 onChange={(e) => setUserConfig({...userConfig, phoneNumber: e.target.value})}
                                 autoFocus
                               />
                             ) : (
                               userConfig.phoneNumber || ""
                             )}
                         </span>
                     </div>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Department</span>
                         <span className='profileFieldValue'>
                             {isEditing ? (
                               <input
                                 style={{ background: "none", border: "none", color: "white", outline:"none", fontSize: "14px"}}
                                 value={userConfig.department || ""}
                                 onChange={(e) => setUserConfig({...userConfig, department: e.target.value})}
                               />
                             ) : (
                               userConfig.department || ""
                             )}</span>
                     </div>
                 </div>
             </section>
             <div className='profileSectionDivider' />
             <section className='profileInfoSection'>
                 <h4 className='profileSectionLabel'>Work Details</h4>
                 <div className='profileInfoGrid'>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>EMPLOYEE ID</span>
                         <span className='profileFieldValue profileMonospace'>
                             {isEditing ? (
                               <input
                                 style={{ background: "none", border: "none", color: "white", outline:"none", fontSize: "14px"}}
                                 value={userConfig.employeeId || ""}
                                 onChange={(e) => setUserConfig({...userConfig, employeeId: e.target.value})}
                               />
                             ) : (
                               userConfig.employeeId || ""
                             )}</span>
                     </div>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Role</span>
                         <span className='profileFieldValue'>
                             {isEditing ? (
                               <input
                                 style={{ background: "none", border: "none", color: "white", outline:"none", fontSize: "14px"}}
                                 value={userConfig.role || ""}
                                 onChange={(e) => setUserConfig({...userConfig, role: e.target.value})}
                               />
                             ) : (
                               userConfig.role || ""
                             )}</span>
                     </div>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Primary Location</span>
                         <span className='profileFieldValue'>
                             {isEditing ? (
                               <input
                                 style={{ background: "none", border: "none", color: "white", outline:"none", fontSize: "14px"}}
                                 value={userConfig.location || ""}
                                 onChange={(e) => setUserConfig({...userConfig, location: e.target.value})}
                               />
                             ) : (
                               userConfig.location || ""
                             )}</span>
                     </div>
                     <div className='profileInfoField'>
                         <span className='profileFieldLabel'>Joined</span>
                         <span className='profileFieldValue'>{date}</span>
                     </div>
                 </div>
             </section>
         </div>
    );
}

function Account(){
    const [password, setPassword] = useState("")
    const { deleteMutation } = useAuth();

    return (
        <div className='pAccContainer'>
            <div className="pAccTxt">
                <p>DELETING YOUR ACCOUNT IS PERMANENT. <br/>ALL DATA WILL BE LOST IF YOU WISH TO PROCEED ENTER YOUR PASSWORD.</p>
            </div>
            <div className="pAccContent">
                <input 
                    type="password"
                    placeholder='password'
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
					style={{textAlign: "center"}}
                />
               {deleteMutation.isError && <p>{deleteMutation.error.message}</p>}
                <button 
                    onClick={() => deleteMutation.mutate({ password })}
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending ? 'DELETING...' : 'DELETE ACCOUNT'}
                </button>
            </div>
        </div>
    );
}


const notiConfig = {
    'Approved': {
        icon: <Check />,
        style: 'notiApproved',
        color: '#abf7b1'
    },
    'Follow Up': {
        icon: <Clock />,
        style: 'notiFollowup',
        color: '#FFFFE0'
    },
    'Unpaid': {
        icon: <PiggyBank />,
        style: 'notiUnpaid',
        color: '#FF7F7F'
    }
}


function Notifications() {
    const [clear, setClear] = useState(false);
    const [notiPage, setNotiPage] = useState(1);
    const notiLimit = 4;
    const { notifications, paginated, isLoading, isError } = useNotiHook({notiPage, notiLimit, clear});

    return(
		<div className='pNotiContainer'>
			<div className="pNotiGrid">
				<div className="pNotiBtns">
					<button
						disabled = {notifications?.length === 0 ? true : false}
						onClick={() => setClear(true)}
					>
						Clear
					</button>
				</div>
				<div className='pNotiList'>
					{notifications?.length === 0 ? 
						<p className='pNotiEmpty'>No Notifications</p> :
						notifications.map((noti) => {
							const { icon, style, color } = notiConfig[noti.type]
							return(
								<div key={noti.quoteId} className={`pNotis ${style}`} style={{borderLeft:`3.2px solid ${color}`}}>
									<span className="pNotiIcon" style={{color, background: `${color}20`}}>{icon}</span>
									<div className="pNotiContent">
										<div className="pNotiHead">{noti.type}</div>
										<div className="pNotiMid">
											<p className='pNotiMsg'>{noti.message}</p>
										</div>
										<div className='pNotiLow'>
											<p className='pNotiPrice'>${noti.total}</p>
										</div>
									</div>
								</div>
							)
						})
					}
				</div>
				<div className='notiPageBtnContainer'>
					<button
							disabled = {paginated?.prevPage ? false : true}
							onClick={() => setNotiPage(p => p -1)}
						>
							<ChevronLeft />
						</button>
						<button 
							disabled = {paginated?.nextPage ? false : true}
							onClick={() => setNotiPage(p => p +1)}
						>
							<ChevronRight />
						</button>
				</div>
			</div>
		</div>
    )
} 


export function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [currView, setCurrView] = useState('overview');
    const { data, isLoading, isError } = useQuickAccess();
    const {  created_at, nameInitials, userId, email } = useUserContext()
    const [userConfig, setUserConfig] = useState({})


	const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        if (!userId) return;
        const saved = localStorage.getItem(`userConfig`);
		 setUserConfig(saved ? JSON.parse(saved) : {
          phoneNumber: "",
          location: "",
          department: "",
          role: "",
          employeeId: ""
        });
    }, [userId]);


    const date = created_at?.split("T")[0];
   
    const viewMap = {
        overview: <Overview 
                        userConfig={userConfig} 
                        setUserConfig={setUserConfig} 
                        userId={userId} 
                        email={email}
                        isEditing={isEditing}
                    />,
        notifications: <Notifications />,
        account: <Account />,
    };


    function handleSave(){
        localStorage.setItem(`userConfig`, JSON.stringify(userConfig));
        setIsEditing(false);
    }
    function handleEdit(){
        setIsEditing(true);
    }

    return (
        <div className='profilePage'>
			<header className="profileHeader">
				<NavBar />
			</header>
            <div className='profileBody'>
                <div className='profileHeaderCard'>
                    <div className='profileHeaderLeft'>
                        <div className='profileAvatar'>{nameInitials}</div>
                        <div className='profileHeaderInfo'>
                            <div className='profileNameRow'>
                                <h2 className='profileName'>{user.first_name} {user.last_name}</h2>
                                <span className='profileActiveBadge'>● ACTIVE</span>
                            </div>
                            <p className='profileSubtitle'>
                                {userConfig.role}
                                <span className='profileSubDot'>·</span>
                                {userConfig.department}
                                <span className='profileSubDash'>—</span>
                                {userConfig.location}
                            </p>
                            {/* <p className='profileLastLogin'>
                                Last login: <span>{user.lastLogin}</span>
                            </p> */}
                        </div>
                    </div>
                    <button 
                        className='editProfileBtn'
                        onClick={() => {
                            setIsEditing((prev) => !prev);
                            isEditing ? handleSave() : handleEdit()
                        }}
                    >
                        {isEditing ? "Save" : "✏ Edit Profile"}
                    </button>
                </div>
                <div className='profileStatsRow'>
                    <ProfileCard
                        icon={<Briefcase />}
                        value={data?.activeJobs?.length ?? 0}
                        isLoading={isLoading}
                        isError={isError}
                        label='ACTIVE JOBS'
                    /> 
                    <ProfileCard
                        icon={<BookCheck />}
                        value={data?.completedJobs?.length ?? 0}
                        isLoading={isLoading}
                        isError={isError}
                        label='COMPLETED JOBS'
                     />
                    <ProfileCard
                        icon={<HandCoins />}
                        value={`$ ${data?.monthlyTotal ?? 0}`}
                        isLoading={isLoading}
                        isError={isError}
                        label='MONTHLY REVENUE'
                     />
                    <ProfileCard
                        icon={<Star />}
                        value={dayjs(date).fromNow()}
                        isLoading={isLoading}
                        isError={isError}
                        label='MEMBER SINCE'
                     />
                </div>
                <div className='profileTabSection'>
                    <div className='profileTabs'>
                        {['overview', 'notifications', 'account'].map(tab => (
                            <button
                                key={tab}
                                className={`profileTab ${currView === tab ? 'active' : ''}`}
                                onClick={() => setCurrView(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className='profileTabContent'>
                        {viewMap[currView]}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ icon, value, label, isLoading, isError }){
    return(
        <div className='profileStatCard'>
            <span className='profileStatIcon'>{icon}</span>
            {isLoading ? (
                <span className="profileStatValue">—</span>
            ): isError ? (
                <span className="profileStatValue">—</span>
            ): (
                <span className="profileStatValue">{value}</span>
            )}
            {label && <span className='profileStatLabel'>{label}</span>}
        </div>
    )
}
