import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Blockchain } from '../utils/blockchain/Blockchain';

const ValidatorDashboard = () => {
    const [pendingTransactions, setPendingTransactions] = useState([]);
    const [blockchain, setBlockchain] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeBlockchain = async () => {
            // Check if validator is logged in
            const isLoggedIn = localStorage.getItem('validatorLoggedIn');
            if (!isLoggedIn) {
                navigate('/validator-login');
                return;
            }

            // Initialize blockchain
            const chain = new Blockchain();
            await chain.initialize(); 
            setBlockchain(chain);
        };

        initializeBlockchain();
    }, [navigate]);

    const validateTransaction = async (transaction) => {
        try {
            if (await transaction.isValid()) {
                blockchain.addTransaction(transaction);
                setPendingTransactions(prevTransactions => 
                    prevTransactions.filter(t => t !== transaction)
                );
                alert('Transaction validated and added to pending transactions!');
            }
        } catch (error) {
            alert('Invalid transaction: ' + error.message);
        }
    };

    const mineBlock = async () => {
        if (blockchain && blockchain.pendingTransactions.length > 0) {
            await blockchain.minePendingTransactions('validator-address');
            alert('Block mined successfully!');
            setPendingTransactions([]);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Validator Dashboard</h1>
            
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Pending Transactions</h2>
                {pendingTransactions.length === 0 ? (
                    <p>No pending transactions</p>
                ) : (
                    <div className="space-y-4">
                        {pendingTransactions.map((transaction, index) => (
                            <div key={index} className="border p-4 rounded-lg">
                                <p>From: {transaction.fromAddress}</p>
                                <p>To: {transaction.toAddress}</p>
                                <p>Amount: {transaction.amount}</p>
                                <button
                                    onClick={() => validateTransaction(transaction)}
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Validate
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={mineBlock}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
                Mine New Block
            </button>
        </div>
    );
};

export default ValidatorDashboard; 