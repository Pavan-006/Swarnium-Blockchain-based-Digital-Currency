import React, { useEffect, useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';

const GovernmentDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [governmentBalance, setGovernmentBalance] = useState("0");
    const [processingRequestId, setProcessingRequestId] = useState(null);
    const [privateKey, setPrivateKey] = useState("");
    const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(null);
    const [notification, setNotification] = useState(null);

    const { 
        pendingRequests, 
        loadPendingRequests,
        approveRequest,
        rejectRequest,
        loadGovernmentData,
        resetBlockchain
    } = useBlockchain();

    useEffect(() => {
        fetchData();
        
        const interval = setInterval(() => {
            fetchData();
        }, 10000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            loadPendingRequests();
            const balance = loadGovernmentData();
            setGovernmentBalance(balance);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveRequest = async (requestId) => {
        setShowPrivateKeyModal(requestId);
    };

    const submitPrivateKey = async () => {
        try {
            setProcessingRequestId(showPrivateKeyModal);
            const result = await approveRequest(showPrivateKeyModal, privateKey);
            
            if (result) {
                setNotification({
                    message: `Request ${showPrivateKeyModal} approved! Signature matched.`,
                    type: 'success'
                });
                setTimeout(() => setNotification(null), 3000);
                
                setPendingRequests(current => 
                    current.filter(req => req.id !== showPrivateKeyModal)
                );
                
                fetchData();
            }
        } catch (error) {
            console.error('Error approving request:', error);
            setNotification({
                message: 'Error approving request: ' + error.message,
                type: 'error'
            });
            setTimeout(() => setNotification(null), 3000);
        } finally {
            setProcessingRequestId(null);
            setShowPrivateKeyModal(null);
            setPrivateKey("");
        }
    };

    const handleRejectRequest = async (requestId) => {
        try {
            setProcessingRequestId(requestId);
            await rejectRequest(requestId);
            
            setPendingRequests(current => 
                current.filter(req => req.id !== requestId)
            );
            
            alert('Request rejected!');
            fetchData();
        } catch (error) {
            console.error('Error rejecting request:', error);
            alert('Error rejecting request: ' + error.message);
        } finally {
            setProcessingRequestId(null);
        }
    };

    const handleResetData = () => {
        if (window.confirm('WARNING: This will reset all data and balances. Are you sure?')) {
            resetBlockchain();
            alert('Data has been reset. All records cleared.');
            fetchData();
        }
    };

    const formatAddress = (address) => {
        if (!address) return 'System';
        if (address.startsWith('client')) {
            return address;
        }
        if (address.length > 15) {
            return `${address.slice(0, 6)}...${address.slice(-4)}`;
        }
        return address;
    };

    if (loading && !pendingRequests.length) {
        return <div className="text-white p-5">Loading dashboard data...</div>;
    }

    return (
        <div className="container mx-auto p-4 text-white">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Government Dashboard</h1>
                <button 
                    onClick={fetchData}
                    className="bg-[#2952e3] text-white px-4 py-2 rounded hover:bg-[#2546bd]"
                >
                    Refresh Data
                </button>
            </div>
            
            <div className="bg-[#181918] p-4 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4">Government Balance</h2>
                <p className="text-xl">{governmentBalance} Swarium</p>
                <p className="text-sm text-gray-400 mt-2">This balance is used to fulfill client coin requests</p>
            </div>

            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${
                    notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`}>
                    {notification.message}
                </div>
            )}

            {showPrivateKeyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-[#181918] p-6 rounded-lg">
                        <h3 className="text-xl text-white mb-4">Enter Government Private Key</h3>
                        <input
                            type="password"
                            placeholder="Private Key"
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            className="w-full p-3 rounded bg-transparent border border-white text-white mb-4"
                            required
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={submitPrivateKey}
                                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShowPrivateKeyModal(null)}
                                className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-[#181918] p-4 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4">Pending Requests</h2>
                {pendingRequests.length === 0 ? (
                    <p>No pending requests at this time</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-white">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-3 text-left">Time</th>
                                    <th className="py-3 text-left">From</th>
                                    <th className="py-3 text-left">Amount</th>
                                    <th className="py-3 text-left">Reason</th>
                                    <th className="py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingRequests.map((request, index) => (
                                    <tr key={index} className="border-b border-gray-700 hover:bg-[#1c1c1c]">
                                        <td className="py-3">
                                            {request.timestamp 
                                                ? new Date(request.timestamp).toLocaleString() 
                                                : 'Pending'}
                                        </td>
                                        <td className="py-3">{formatAddress(request.fromAddress)}</td>
                                        <td className="py-3">{request.amount} Swarium</td>
                                        <td className="py-3">{request.reason || 'N/A'}</td>
                                        <td className="py-3">
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleApproveRequest(request.id)}
                                                    disabled={processingRequestId === request.id}
                                                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded disabled:opacity-50"
                                                >
                                                    {processingRequestId === request.id ? 'Processing...' : 'Approve'}
                                                </button>
                                                <button 
                                                    onClick={() => handleRejectRequest(request.id)}
                                                    disabled={processingRequestId === request.id}
                                                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded disabled:opacity-50"
                                                >
                                                    {processingRequestId === request.id ? 'Processing...' : 'Reject'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GovernmentDashboard;