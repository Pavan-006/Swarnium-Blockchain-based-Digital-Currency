import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GovernmentLogin = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        // Check government credentials
        if (credentials.username === 'government' && credentials.password === 'gov123') {
            // Store login state and user info
            localStorage.setItem('govLoggedIn', 'true');
            localStorage.setItem('govId', credentials.username);
            // Navigate to the correct route
            navigate('/government-dashboard');
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg-welcome">
            <div className="bg-[#181918] p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-3xl text-white font-bold mb-6 text-center">Government Login</h2>
                {error && (
                    <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-white text-sm">Username</label>
                        <input
                            type="text"
                            value={credentials.username}
                            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                            className="w-full p-3 mt-1 rounded bg-transparent border border-white text-white"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-white text-sm">Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            className="w-full p-3 mt-1 rounded bg-transparent border border-white text-white"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd]"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-white text-sm">Default Credentials:</p>
                    <p className="text-gray-400 text-xs">Username: government</p>
                    <p className="text-gray-400 text-xs">Password: gov123</p>
                </div>
            </div>
        </div>
    );
};

export default GovernmentLogin; 