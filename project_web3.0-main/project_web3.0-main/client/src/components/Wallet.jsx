import React, { useState, useEffect } from 'react';
import { useBlockchain } from '../context/BlockchainContext'; // We'll create this next

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const { blockchain, address } = useBlockchain();

    useEffect(() => {
        if (blockchain && address) {
            const walletBalance = blockchain.getBalanceOfAddress(address);
            setBalance(walletBalance);
        }
    }, [blockchain, address]);

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await blockchain.createTransaction(address, recipient, Number(amount));
            alert('Transaction submitted for validation!');
            setRecipient('');
            setAmount('');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Your SWARNIUM Wallet</h2>
                <div className="mb-6">
                    <p className="text-xl">Balance: {balance} SWARNIUM</p>
                </div>

                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Recipient Address
                        </label>
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Amount (SWARNIUM)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Transfer
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Wallet; 