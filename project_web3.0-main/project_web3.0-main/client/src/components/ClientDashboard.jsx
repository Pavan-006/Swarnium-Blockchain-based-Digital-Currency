import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlockchain } from '../context/BlockchainContext';
import { FaCopy } from 'react-icons/fa';

const ClientDashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState("0");
    const [requestAmount, setRequestAmount] = useState("");
    const [requestReason, setRequestReason] = useState("");
    const [requestPrivateKey, setRequestPrivateKey] = useState("");
    const [sendAmount, setSendAmount] = useState("");
    const [sendToAddress, setSendToAddress] = useState("");
    const [sendReason, setSendReason] = useState("");
    const [sendPrivateKey, setSendPrivateKey] = useState("");
    const [sendTitle, setSendTitle] = useState("Send Coins to Another Client");
    const [loading, setLoading] = useState(false);
    const [myTransactions, setMyTransactions] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [copied, setCopied] = useState(false);

    const { requestCoins, sendCoins, getBalance, transactions, pendingRequests, requestTransfer } = useBlockchain();
    const clientId = localStorage.getItem('clientId');
    const clientName = localStorage.getItem('clientName') || clientId;

    useEffect(() => {
        if (!clientId) {
            navigate('/client-login');
            return;
        }
        loadClientData();
    }, [clientId, navigate, transactions, pendingRequests]);

    const loadClientData = async () => {
        try {
            const bal = await getBalance(clientId);
            setBalance(bal);
            
            const allTxs = transactions;
            console.log("All transactions available:", allTxs.length, allTxs);
            
            const myTxs = allTxs.filter(tx => 
                (tx.fromAddress && tx.fromAddress.toLowerCase() === clientId.toLowerCase()) || 
                (tx.toAddress && tx.toAddress.toLowerCase() === clientId.toLowerCase())
            );
            console.log("Filtered transactions for client:", clientId, myTxs.length, myTxs);
            setMyTransactions(myTxs);
            
            const myReqs = pendingRequests.filter(req => 
                req.fromAddress.toLowerCase() === clientId.toLowerCase()
            );
            setMyRequests(myReqs);
        } catch (error) {
            console.error("Error loading client data:", error);
        }
    };

    const handleRequestAmountChange = (e) => {
        const value = e.target.value;
        // Allow empty input or valid numbers in range [0.001, 1000]
        if (value === '') {
            setRequestAmount('');
        } else if (!isNaN(value) && Number(value) >= 0.001 && Number(value) <= 1000) {
            const formattedValue = Number(value).toFixed(3);
            setRequestAmount(formattedValue);
        }
    };

    const handleSendAmountChange = (e) => {
        const value = e.target.value;
        // Allow empty input or valid numbers in range [0.001, 1000]
        if (value === '') {
            setSendAmount('');
        } else if (!isNaN(value) && Number(value) >= 0.001 && Number(value) <= 1000) {
            const formattedValue = Number(value).toFixed(3);
            setSendAmount(formattedValue);
        }
    };

    const handleRequestCoins = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await requestCoins(Number(requestAmount), requestReason, requestPrivateKey);
            alert('Request sent successfully!');
            setRequestAmount("");
            setRequestReason("");
            setRequestPrivateKey("");
            await loadClientData();
        } catch (error) {
            alert('Error sending request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendCoins = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            
            const isClientToClient = sendToAddress.startsWith('client');
            
            if (isClientToClient) {
                await requestTransfer(sendToAddress, Number(sendAmount), sendReason, sendPrivateKey);
                alert('Transfer request sent for government approval!');
            } else {
                await sendCoins(sendToAddress, Number(sendAmount), sendReason, sendPrivateKey);
                alert('Transaction sent successfully!');
            }
            
            setSendAmount("");
            setSendToAddress("");
            setSendReason("");
            setSendPrivateKey("");
            
            await loadClientData();
        } catch (error) {
            alert('Error sending coins: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAddress = async () => {
        try {
            await navigator.clipboard.writeText(clientId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            alert('Address copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy address:', error);
        }
    };

    return (
        <div className="min-h-screen gradient-bg-welcome p-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-[#181918] rounded-lg p-6 mb-6">
                    <h2 className="text-2xl text-white mb-4">Client Dashboard - {clientName}</h2>
                    
                    <div className="bg-[#2952e3] p-4 rounded-lg mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-white text-lg">Your Balance:</p>
                                <p className="text-white text-3xl font-bold">{balance} SWARNIUM</p>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-white text-sm mb-1">Your ID:</p>
                                <div className="flex items-center bg-[#2546bd] rounded-lg p-2">
                                    <p className="text-white font-mono mr-2">
                                        {clientId}
                                    </p>
                                    <button
                                        onClick={handleCopyAddress}
                                        className="bg-[#1c3a8c] hover:bg-[#152c6e] p-2 rounded-lg transition-colors duration-200"
                                        title="Copy address"
                                    >
                                        <FaCopy className="text-white" />
                                    </button>
                                </div>
                                {copied && (
                                    <span className="text-green-400 text-sm mt-1">
                                        Copied!
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-[#181918] p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl text-white mb-4">Request Coins</h3>
                            <form onSubmit={handleRequestCoins} className="space-y-4">
                                <div>
                                    <label className="text-white text-sm">Amount (Swarnium)</label>
                                    <input
                                        type="number"
                                        placeholder="Amount (0.001 - 1000)"
                                        value={requestAmount}
                                        onChange={handleRequestAmountChange}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                        min="0.001"
                                        max="1000"
                                        step="0.001"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Reason for request"
                                        value={requestReason}
                                        onChange={(e) => setRequestReason(e.target.value)}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Enter Private Key"
                                        value={requestPrivateKey}
                                        onChange={(e) => setRequestPrivateKey(e.target.value)}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#2952e3] text-white py-2 px-4 rounded hover:bg-[#2546bd] disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Request Coins'}
                                </button>
                            </form>
                        </div>

                        <div className="bg-[#181918] p-6 rounded-lg border border-gray-700">
                            <h3 className="text-xl text-white mb-4">Send Coins</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Note: Transfers to other clients (client1, client2, etc.) require government approval.
                            </p>
                            <form onSubmit={handleSendCoins} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Recipient Address (e.g., client2)"
                                        value={sendToAddress}
                                        onChange={(e) => {
                                            setSendToAddress(e.target.value);
                                            setSendTitle(e.target.value.startsWith('client') ? 
                                                "Send Coins to Another Client (Requires Approval)" : 
                                                "Send Coins"
                                            );
                                        }}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-white text-sm">Amount (Swarnium)</label>
                                    <input
                                        type="number"
                                        placeholder="Amount (0.001 - 1000)"
                                        value={sendAmount}
                                        onChange={handleSendAmountChange}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                        min="0.001"
                                        max="1000"
                                        step="0.001"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Reason for sending"
                                        value={sendReason}
                                        onChange={(e) => setSendReason(e.target.value)}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        placeholder="Enter Private Key"
                                        value={sendPrivateKey}
                                        onChange={(e) => setSendPrivateKey(e.target.value)}
                                        className="w-full p-3 rounded bg-transparent border border-white text-white"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#2952e3] text-white py-2 px-4 rounded hover:bg-[#2546bd] disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : sendTitle}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl text-white mb-4">Your Transactions</h3>
                        {myTransactions.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-white">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="py-3 text-left">Type</th>
                                            <th className="py-3 text-left">Amount</th>
                                            <th className="py-3 text-left">Counterparty</th>
                                            <th className="py-3 text-left">Reason</th>
                                            <th className="py-3 text-left">Status</th>
                                            <th className="py-3 text-left">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myTransactions.map((tx, index) => (
                                            <tr key={index} className="border-b border-gray-700">
                                                <td className="py-3">
                                                    {tx.fromAddress === clientId ? 'Sent' : 'Received'}
                                                </td>
                                                <td className="py-3">{tx.amount} SWARNIUM</td>
                                                <td className="py-3">
                                                    {tx.fromAddress === clientId ? tx.toAddress : tx.fromAddress}
                                                </td>
                                                <td className="py-3">{tx.reason || 'N/A'}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded ${
                                                        tx.status === 'APPROVED' ? 'bg-green-600' : 
                                                        tx.status === 'REJECTED' ? 'bg-red-600' : 'bg-yellow-600'
                                                    }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                                <td className="py-3">{new Date(tx.timestamp).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-white text-center py-4">
                                No transactions yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;