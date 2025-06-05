import React, { useEffect, useState } from 'react';
import { useBlockchain } from '../context/BlockchainContext';
import SHA256 from 'crypto-js/sha256';

const Market = () => {
    const [transactions, setTransactions] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [processedRequests, setProcessedRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('transactions');
    const [loading, setLoading] = useState(true);
    const { getAllTransactions, getPendingRequests, loadTransactions, loadPendingRequests } = useBlockchain();

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
            loadTransactions();
            loadPendingRequests();
            const txs = getAllTransactions();
            const requests = getPendingRequests();

            // Add hash to each transaction
            const txsWithHash = txs.map(tx => ({
                ...tx,
                hash: generateHash(tx),
            }));

            setTransactions(txsWithHash);
            setPendingRequests(requests);

            const processedReqs = txs
                .filter(tx => tx.type === 'Sanction')
                .map(tx => ({
                    id: tx.originalRequestId || `PROCESSED_${tx.id}`,
                    fromAddress: tx.toAddress,
                    toAddress: tx.fromAddress,
                    amount: tx.amount,
                    reason: tx.reason,
                    status: tx.status,
                    timestamp: tx.timestamp,
                    processed: true,
                }));

            setProcessedRequests(processedReqs);
        } catch (error) {
            console.error("Error fetching blockchain data:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateHash = (tx) => {
        const data = `${tx.fromAddress}-${tx.toAddress}-${tx.amount}-${tx.timestamp}-${tx.type}-${tx.reason}-${tx.status}`;
        return SHA256(data).toString();
    };

    const formatAddress = (address) => {
        if (!address) return 'System';
        if (address.startsWith('client')) return address;
        if (address.length > 15) return `${address.slice(0, 6)}...${address.slice(-4)}`;
        return address;
    };

    return (
        <div className="min-h-screen gradient-bg-welcome p-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-[#181918] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl text-white">Blockchain Explorer</h2>
                        <button 
                            onClick={fetchData}
                            className="bg-[#2952e3] text-white px-4 py-2 rounded hover:bg-[#2546bd]"
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="flex border-b border-gray-700 mb-6">
                        <button 
                            className={`px-4 py-2 mr-2 ${activeTab === 'transactions' 
                                ? 'bg-[#2952e3] text-white' 
                                : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('transactions')}
                        >
                            Transactions ({transactions.length})
                        </button>
                        <button 
                            className={`px-4 py-2 mr-2 ${activeTab === 'requests' 
                                ? 'bg-[#2952e3] text-white' 
                                : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setActiveTab('requests')}
                        >
                            Pending Requests ({pendingRequests.length})
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-white text-center py-10">Loading data...</div>
                    ) : activeTab === 'transactions' ? (
                        transactions.length === 0 ? (
                            <div className="text-white text-center py-10">
                                No transactions found in the blockchain.
                                <p className="mt-2 text-gray-400">
                                    Transactions appear here after they are approved and added to the blockchain.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-white">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="py-3 text-left">Time</th>
                                            <th className="py-3 text-left">Type</th>
                                            <th className="py-3 text-left">From</th>
                                            <th className="py-3 text-left">To</th>
                                            <th className="py-3 text-left">Amount</th>
                                            <th className="py-3 text-left">Reason</th>
                                            <th className="py-3 text-left">Status</th>
                                            <th className="py-3 text-left">Hash</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx, index) => (
                                            <tr key={index} className="border-b border-gray-700 hover:bg-[#1c1c1c]">
                                                <td className="py-3">{new Date(tx.timestamp).toLocaleString()}</td>
                                                <td className="py-3">{tx.type || 'TRANSFER'}</td>
                                                <td className="py-3">{formatAddress(tx.fromAddress)}</td>
                                                <td className="py-3">{formatAddress(tx.toAddress)}</td>
                                                <td className="py-3">{tx.amount} SWARNIUM</td>
                                                <td className="py-3">{tx.reason || 'N/A'}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded ${
                                                        tx.status === 'APPROVED' ? 'bg-green-600' :
                                                        tx.status === 'REJECTED' ? 'bg-red-600' : 'bg-yellow-600'
                                                    }`}>
                                                        {tx.status || 'PENDING'}
                                                    </span>
                                                </td>
                                                <td className="py-3 break-all" style={{ maxWidth: '200px' }}>
                                                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : activeTab === 'requests' ? (
                        pendingRequests.length === 0 ? (
                            <div className="text-white text-center py-10">
                                No pending requests at this time.
                                <p className="mt-2 text-gray-400">
                                    When clients request coins, they will appear here until approved or rejected.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-white">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="py-3 text-left">Time</th>
                                            <th className="py-3 text-left">Requester</th>
                                            <th className="py-3 text-left">Amount</th>
                                            <th className="py-3 text-left">Reason</th>
                                            <th className="py-3 text-left">Status</th>
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
                                                <td className="py-3">{request.amount} SWARNIUM</td>
                                                <td className="py-3">{request.reason || 'N/A'}</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 rounded bg-yellow-600">
                                                        PENDING APPROVAL
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : (
                        processedRequests.length === 0 ? (
                            <div className="text-white text-center py-10">
                                No processed requests to display.
                                <p className="mt-2 text-gray-400">
                                    Processed requests are client requests that have been approved or rejected.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-white">
                                    <thead>
                                        <tr className="border-b border-gray-700">
                                            <th className="py-3 text-left">Time</th>
                                            <th className="py-3 text-left">Requester</th>
                                            <th className="py-3 text-left">Amount</th>
                                            <th className="py-3 text-left">Reason</th>
                                            <th className="py-3 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {processedRequests.map((request, index) => (
                                            <tr key={index} className="border-b border-gray-700 hover:bg-[#1c1c1c]">
                                                <td className="py-3">
                                                    {request.timestamp 
                                                        ? new Date(request.timestamp).toLocaleString() 
                                                        : 'Unknown'}
                                                </td>
                                                <td className="py-3">{formatAddress(request.fromAddress)}</td>
                                                <td className="py-3">{request.amount} SWARNIUM</td>
                                                <td className="py-3">{request.reason || 'N/A'}</td>
                                                <td className="py-3">
                                                    <span className="px-2 py-1 rounded bg-green-600">
                                                        APPROVED
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Market;
