import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Link } from "react-router-dom";

export function AuthForm({ isAuth, onSubmit, isPending, onSwitch }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <form className="authForm" onSubmit={onSubmit}>
            {!isAuth && (
                <div className="authInputGroup">
                    <label>Name</label>
                    <div className="authInputWrapper authSignWrapper">
                        <User size={15} className="authSignIcon" />
                    <div className="authInputWrapper">
                        <User size={15} className="authInputIcon" />
                        <input type="text" name="firstName" placeholder="First Name" required />
                        <input type="text" name='lastName' placeholder='Last Name' required/>
                    </div>
                </div>
            )}

            <div className="authInputGroup">
                <label>Email address</label>
                <div className="authInputWrapper">
                    <Mail size={15} className="authInputIcon" />
                    <input type="email" name="email" placeholder="name@company.com" required />
                </div>
            </div>

            <div className="authInputGroup">
                <div className="authLabelRow">
                    <label>Password</label>
                    {isAuth &&  <Link to="/forgot-password" className="authForgot">Forgot?</Link>}
                </div>
                <div className="authInputWrapper">
                    <Lock size={15} className="authInputIcon" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        minLength={8}
                        required
                    />
                    <button type="button" className="authPasswordToggle" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                </div>
            </div>

            {isAuth && (
                <label className="authRemember">
                    <input type="checkbox" name="remember" />
                    <span>Keep me signed in</span>
                </label>
            )}

            <button className="authSubmitBtn" type="submit" disabled={isPending}>
                {isPending ? 'Signing in...' : isAuth ? 'Sign In' : 'Sign Up'}
            </button>

            <p className="authSwitch">
                {isAuth ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button type="button" onClick={onSwitch}>
                    {isAuth ? 'Create one now' : 'Sign in'}
                </button>
            </p>

        </form>
    );
}
