import React, { useState } from 'react';

const ClientWallet = () => {
    const [clientId, setClientId] = useState('');
    const [showAddress, setShowAddress] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');

    const generateWalletAddress = () => {
        // Generate a simple unique address for the client
        const newAddress = 'CLIENT_' + clientId.toUpperCase() + '_' + Date.now().toString().slice(-6);
        setWalletAddress(newAddress);
        setShowAddress(true);
    };

    return (
        <div className="min-h-screen gradient-bg-welcome flex items-center justify-center">
            <div className="bg-[#181918] p-8 rounded-lg shadow-xl max-w-md w-full">
                <h2 className="text-3xl text-white font-bold mb-6 text-center">Get Your Wallet Address</h2>
                
                {!showAddress ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-white block mb-2">Enter Your ID/Name:</label>
                            <input
                                type="text"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                className="w-full p-3 rounded bg-transparent border border-white text-white"
                                placeholder="Enter your ID or Name"
                            />
                        </div>
                        <button
                            onClick={generateWalletAddress}
                            disabled={!clientId}
                            className="w-full bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd] disabled:bg-gray-600"
                        >
                            Get Wallet Address
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-[#2952e3] p-4 rounded-lg">
                            <p className="text-white text-sm mb-2">Your Wallet Address:</p>
                            <p className="text-white font-mono break-all">{walletAddress}</p>
                        </div>
                        <div className="bg-[#181918] p-4 rounded-lg border border-white">
                            <p className="text-white text-sm">Instructions:</p>
                            <ol className="text-white text-sm list-decimal pl-4 mt-2 space-y-1">
                                <li>Copy this wallet address</li>
                                <li>Share it with the government</li>
                                <li>Receive your SWARNIUM coins</li>
                                <li>Use this address for transactions</li>
                            </ol>
                        </div>
                        <button
                            onClick={() => {
                                setShowAddress(false);
                                setClientId('');
                                setWalletAddress('');
                            }}
                            className="w-full border border-white text-white py-2 px-4 rounded hover:bg-white hover:text-black"
                        >
                            Generate New Address
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientWallet; 