import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/auth.hooks.jsx';
import { AuthForm } from '../comps/authForm.jsx';
import { Loader } from "lucide-react";
import logo from "../imgs/logo.svg";

export function Authentication() {
    const [isAuth, setAuth] = useState(true);
    const { loginMutation, signupMutation } = useAuth();

    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = Object.fromEntries(formData);
        isAuth ? loginMutation.mutate(credentials) : signupMutation.mutate(credentials);
    }

    return (
        <div className="authPage">
            <div className="authLeft">
                <div className="authLogo">
                    <img className="authLogoIcon" src={logo} />
                    <span>FIELD HQ</span>
                </div>
				<div className="authContent">
					<div className="authTopSection">
						<div className="authTabs">
							<button className={`authTab ${isAuth ? 'active' : ''}`} onClick={() => setAuth(true)}>
								Sign In
							</button>
							<button className={`authTab ${!isAuth ? 'active' : ''}`} onClick={() => setAuth(false)}>
								Sign Up
							</button>
						</div>
						<div className="authHeader">
							<h1>{isAuth ? 'Welcome Back' : 'Create Account'}</h1>
							<p>{isAuth ? 'Sign in to manage your jobs and quotes' : 'Sign up to start managing your business'}</p>
						</div>
					</div>
					<AuthForm
						key={isAuth}
						isAuth={isAuth}
						onSubmit={handleSubmit}
						isPending={isAuth ? loginMutation.isPending : signupMutation.isPending}
						onSwitch={() => setAuth(prev => !prev)}
					/>
				</div>
            </div>
            <div className="authRight">
                <div className="mockWindow">
                    <div className="mockWindowBar">
                        <span className="mockDot mockDotRed" />
                        <span className="mockDot mockDotYellow" />
                        <span className="mockDot mockDotGreen" />
                    </div>
                    <div className="mockStats">
                        <div className="mockStatCard mockStatAccent">
                            <span className="mockStatLabel">Active Jobs</span>
                            <span className="mockStatValue">24</span>
                        </div>
                        <div className="mockStatCard mockStatAccent">
                            <span className="mockStatLabel">Pending Quotes</span>
                            <span className="mockStatValue">12</span>
                        </div>
                        <div className="mockStatCard mockStatAccent">
                            <span className="mockStatLabel">Revenue</span>
                            <span className="mockStatValue">$14.2k</span>
                        </div>
                    </div>
                    <div className="mockJobs">
                        <div className="mockJobsHeader">
                            <span>Recent Jobs</span>
                            <span className="mockViewAll">View All</span>
                        </div>
                        <div className="mockJobItem">
                            <div className="mockJobIcon mockJobIconOrange">⚡</div>
                            <div className="mockJobInfo">
                                <span className="mockJobTitle">Panel Upgrade – Smith Res.</span>
                                <span className="mockJobSub">Scheduled: Today, 2:00 PM</span>
                            </div>
                            <span className="mockBadge mockBadgeGreen">In Progress</span>
                        </div>
                        <div className="mockJobItem">
                            <div className="mockJobIcon mockJobIconBlue">📋</div>
                            <div className="mockJobInfo">
                                <span className="mockJobTitle">Commercial Wiring Quote</span>
                                <span className="mockJobSub">Sent: Yesterday</span>
                            </div>
                            <span className="mockBadge mockBadgeYellow">Pending</span>
                        </div>
                    </div>
                </div>

                <div className="authRightText">
                    <h2>Run your electrical business from one place</h2>
                    <p>Quotes, customers, and job tracking — all in sync.</p>
                    <div className="authBadges">
                        <span className="authBadge">⚡ Live Job Tracking</span>
                        <span className="authBadge">📊 Instant Quotes</span>
                        <span className="authBadge">💳 Payment Ready</span>
                    </div>
                </div>

            </div>

        </div>
    );
}

export function ForgotPassword(){
	const [email, setEmail] = useState('');
	const { sendResetPassword } = useAuth();
	const navigate = useNavigate();
	
	function handleSubmit(e){
		e.preventDefault();
		sendResetPassword.mutate(email);
	}

	return(
		 <div className="forgotPage">
				{sendResetPassword.isSuccess && (
					<div className="overlay">
						<p>Reset link was sent successfully via email.</p>
					</div>
				)}
				{sendResetPassword.isPending && (
					<div className="overlay ">
						<Loader style={{color: "white"}} className='cqLoader'/>
					</div>
				)}
				{sendResetPassword.isError && (
					<div className="overlay ">
						<p className="forgotPassErr">
							<CircleX style={{color: "red"}}/>
							Something went wrong. Please try again.
						</p>
					</div>
				)}
					<header className="forgotHeader">
						<div 
							className="authLogo" 
							onClick={() => navigate('/auth')}	
						>
							<img className="authLogoIcon" src={logo} />
							<span>FIELD HQ</span>
						</div>
					</header>
		<div className="forgotContainer"	>
					<div className="forgotFormContainer">
						<div className="forgotForm">
							<div className="forgotFormTxt">
								<h2>Forgot your password?</h2>
								<p>That's fine happens to the best of us.</p>
								<p>Just enter the email used for you account and follows the given instructions within the email.</p>
							</div>
							<form  className="forgotEmailForm" onSubmit={handleSubmit}>
								<input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" />
								<button type="submit" disabled={sendResetPassword.isPending}>
									{sendResetPassword.isPending ? 'sending...' : 'Send Link'}
								</button>
							</form>
						</div>
				</div>
			</div>
		</div>	
	)
}


export function ResetPassword(){
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");
	const [err, setErr] = useState(false);

	const { resetPasswordPatch, resetPasswordGet } = useAuth();

	if(resetPasswordPatch.isPending) console.log("GET ROUTE HIT");
	if(resetPasswordGet.isError) console.log("GET ERROR", resetPasswordGet.error);



	function handleSubmit(e){
		e.preventDefault();
		if(password !== rePassword){
			setErr(true);
			return;
		}
		setErr(false);	
		resetPasswordPatch.mutate(password);
	};

	return(
		<>
		{resetPasswordGet.error === "jwt expired" && (
			<div className="resetPassPage">
				<p>Your link has expired. Please try again</p>
			</div>
		)}
			<div className="resetPassPage">
				{resetPasswordPatch.isSuccess && (
					<div className="overlay resetOverlay">
						<div className="resetMsg">
							<p>Password reset successfully.</p>
						</div>
					</div>
				)}
				{resetPasswordPatch.isError || resetPasswordGet.isError && (
					<div className="overlay resetOverlay">
						<div className="resetMsg">
							<p>Something went wrong. Please try again.</p>
						</div>
					</div>
				)}
				{resetPasswordPatch.isPending || resetPasswordGet.isLoading && (
					<div className="overlay resetOverlay">
						<div className="resetLoader">
							<Loader />
						</div>
					</div>
				)}	
				<div className="resetFormContainer">
					<header className="resetFormHeader">
						<h2>Choose Your Password</h2>		
						<p>Enter a new password below to change your password.</p>
					</header>
					<form onSubmit={handleSubmit} className="resetForm">
						{ err && (<p className="resetErrMsg">Password's don't match. Please try again.</p>) }
						<input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
						<input type="password" onChange={(e) => setRePassword(e.target.value)} placeholder="New password" />
						<button type="submit" disabled={resetPasswordPatch.isPending}>
							{resetPasswordPatch.isPending ? 'Resetting...' : 'Reset Password'}
						</button>
					</form>
				</div>
			</div>
		</>
	)
}



