import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import { ec as EC } from 'elliptic';

const PREDEFINED_CLIENTS = [
    { id: 'client1', name: 'Client 1', password: 'client1@123' },
    { id: 'client2', name: 'Client 2', password: 'client2@123' },
    { id: 'client3', name: 'Client 3', password: 'client3@123' },
    { id: 'vender1', name: 'Vender 1', password: 'vender1@123' },
    { id: 'vender2', name: 'Vender 2', password: 'vender2@123' },
    { id: 'vender3', name: 'Vender 3', password: 'vender3@123' }
];

const secp256k1 = new EC('secp256k1');

const ClientLogin = () => {
    const [credentials, setCredentials] = useState({
        clientId: '',
        password: ''
    });
    const [isBlockchainReady, setIsBlockchainReady] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { getBalance, createAccount } = useBlockchain();

    useEffect(() => {
        // Generate or load keys for each client
        PREDEFINED_CLIENTS.forEach(client => {
            const keyStorageKey = `${client.id}_keys`;
            let keys = JSON.parse(localStorage.getItem(keyStorageKey));
            
            if (!keys) {
                const keyPair = secp256k1.genKeyPair();
                keys = {
                    privateKey: keyPair.getPrivate('hex'),
                    publicKey: keyPair.getPublic('hex')
                };
                localStorage.setItem(keyStorageKey, JSON.stringify(keys));
                console.log(`Generated keys for ${client.id}:`, keys);
            }
        });

        // Check if blockchain is ready by trying to get a balance
        try {
            const balance = getBalance('government');
            if (balance !== "0") {
                setIsBlockchainReady(true);
            }
        } catch (error) {
            console.error("Blockchain not ready:", error);
            // Will retry on next render
        }
    }, [getBalance]);

    const handleLogin = (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        
        // In production, this should be a secure authentication system
        if (!isBlockchainReady) {
            alert('Blockchain not initialized. Please try again.');
            return;
        }
        
        // Validate password
        const selectedClient = PREDEFINED_CLIENTS.find(c => c.id === credentials.clientId);
        if (!selectedClient) {
            setError('Invalid client selected');
            return;
        }
        
        if (credentials.password !== selectedClient.password) {
            setError('Invalid password');
            return;
        }
        
        // Make sure the client exists in the blockchain
        try {
            // This will create the account if it doesn't exist
            createAccount(credentials.clientId, 0);
            
            // Load client keys from localStorage
            const keyStorageKey = `${credentials.clientId}_keys`;
            const clientKeys = JSON.parse(localStorage.getItem(keyStorageKey));
            
            if (!clientKeys) {
                throw new Error(`Keys not found for ${credentials.clientId}`);
            }

            // Store client info and keys in localStorage
            localStorage.setItem('clientId', credentials.clientId);
            localStorage.setItem('privateKey', clientKeys.privateKey);
            localStorage.setItem('clientName', selectedClient.name);
            localStorage.setItem('clientLoggedIn', 'true');

            // Log keys to console
            console.log(`Logged in as ${selectedClient.id}. Private Key: ${clientKeys.privateKey}`);
            console.log(`Public Key (clientId): ${clientKeys.publicKey}`);
            
            navigate('/client-dashboard');
        } catch (error) {
            setError('Error logging in: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center gradient-bg-welcome">
            <div className="bg-[#181918] p-8 rounded-lg shadow-xl w-96">
                <h2 className="text-3xl text-white font-bold mb-6 text-center">Client Login</h2>
                
                {error && (
                    <div className="bg-red-600 text-white p-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-white text-sm">Select Client</label>
                        <select
                            value={credentials.clientId}
                            onChange={(e) => setCredentials({...credentials, clientId: e.target.value})}
                            className="w-full p-3 mt-1 rounded bg-transparent border border-white text-white"
                            required
                        >
                            <option value="" disabled>Select a client</option>
                            {PREDEFINED_CLIENTS.map(client => (
                                <option key={client.id} value={client.id} className="bg-[#181918]">
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-white text-sm">Password</label>
                        <input
                            type="password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                            className="w-full p-3 mt-1 rounded bg-transparent border border-white text-white"
                            required
                            placeholder="For client1 use client1@123"
                        />
                    </div>
                    <div className="text-white text-xs mt-1">
                        <p><strong>Note:</strong> For each client, use their ID followed by @123</p>
                        <p>Example: client1@123, client2@123, client3@123</p>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ClientLogin;