import React, { createContext, useContext, useState, useEffect } from 'react';
import { Blockchain } from '../utils/blockchain/Blockchain';
import { Transaction } from '../utils/blockchain/Transaction';

const BlockchainContext = createContext();

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({ children }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [blockchain, setBlockchain] = useState(null);

    useEffect(() => {
        initializeBlockchain();
    }, []);

    const initializeBlockchain = () => {
        try {
            // Initialize the blockchain
            const blockchainInstance = new Blockchain();
            setBlockchain(blockchainInstance);

            // Load initial data
            loadPendingRequests();
            loadTransactions();
            setIsLoading(false);
        } catch (error) {
            console.error("Blockchain initialization error:", error);
            setIsLoading(false);
        }
    };

    // Re-load data when blockchain state changes
    useEffect(() => {
        if (blockchain) {
            loadPendingRequests();
            loadTransactions();
        }
    }, [blockchain]);

    const loadPendingRequests = () => {
        try {
            if (!blockchain) return [];
            
            // Get the latest pending requests from the blockchain
            const requests = blockchain.getPendingRequests();
            
            // Update the state with the new data
            setPendingRequests([...requests]);
            
            return requests;
        } catch (error) {
            console.error("Error loading pending requests:", error);
            return [];
        }
    };

    const loadTransactions = () => {
        try {
            if (!blockchain) return [];
            
            // Force clear the existing transactions
            setTransactions([]);
            
            // Then get fresh data from blockchain
            const txns = blockchain.getAllTransactions();
            console.log("Loaded transactions:", txns.length, txns);
            
            // Update the state with a new array
            if (txns.length > 0) {
                setTransactions([...txns]);
            }
            
            return txns;
        } catch (error) {
            console.error("Error loading transactions:", error);
            return [];
        }
    };

    const requestCoins = (amount, reason) => {
        try {
            if (!blockchain) throw new Error("Blockchain not initialized");
            const clientId = localStorage.getItem('clientId');
            if (!clientId) throw new Error("Client ID not found. Please login again.");
            
            const requestId = blockchain.addRequest({
                fromAddress: clientId,
                amount: Number(amount),
                reason: reason,
                timestamp: Date.now(),
                status: 'PENDING'
            });
            loadPendingRequests();
            return requestId;
        } catch (error) {
            console.error("Error requesting coins:", error);
            throw error;
        }
    };

    const sendCoins = (toAddress, amount, reason) => {
        try {
            if (!blockchain) throw new Error("Blockchain not initialized");
            console.log("New Blockchain created.....")
            const clientId = localStorage.getItem('clientId');
            if (!clientId) throw new Error("Client ID not found. Please login again.");
            
            const transaction = new Transaction(
                clientId,
                toAddress,
                Number(amount),
                'TRANSFER',
                'PENDING',
                reason
            );
            blockchain.addTransaction(transaction);
            loadTransactions();
            
            return transaction.id;
        } catch (error) {
            console.error("Error sending coins:", error);
            throw error;
        }
    };

    const approveRequest = async (requestId) => {
        try {
            if (!blockchain) throw new Error("Blockchain not initialized");
            
            console.log("Approving request:", requestId);
            console.log("A new block is added in blockchain")
            
            // First remove the request from the UI state
            setPendingRequests(prev => prev.filter(r => r.id !== requestId));
            
            // Then process the blockchain approval
            await blockchain.validateRequest(requestId, true);
            
            // Force a delay to ensure state updates
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Finally reload all data
            loadPendingRequests();
            loadTransactions();
            
            return requestId;
        } catch (error) {
            console.error("Error approving request:", error);
            throw error;
        }
    };

    const rejectRequest = (requestId) => {
        try {
            if (!blockchain) throw new Error("Blockchain not initialized");
            
            // Remove the request from the blockchain
            blockchain.validateRequest(requestId, false);
            
            // Remove from UI state (this line is necessary because loadPendingRequests may not update immediately)
            setPendingRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
            
            // Reload the data
            loadPendingRequests();
            
            return requestId;
        } catch (error) {
            console.error("Error rejecting request:", error);
            throw error;
        }
    };

    const getBalance = (address) => {
        try {
            if (!blockchain) return "0";
            return blockchain.getBalance(address).toString();
        } catch (error) {
            console.error("Error getting balance:", error);
            return "0";
        }
    };

    const loadGovernmentData = () => {
        try {
            if (!blockchain) return "0";
            return blockchain.getBalance('government').toString();
        } catch (error) {
            console.error("Error loading government data:", error);
            return "0";
        }
    };

    const requestTransfer = (toAddress, amount, reason) => {
        try {
            if (!blockchain) throw new Error("Blockchain not initialized");
            const clientId = localStorage.getItem('clientId');
            if (!clientId) throw new Error("Client ID not found. Please login again.");
            
            // Check if client has enough balance
            const balance = getBalance(clientId);
            if (Number(balance) < Number(amount)) {
                throw new Error("Insufficient balance for transfer");
            }
            
            // Create a transfer request that needs approval
            const requestId = blockchain.addTransferRequest({
                fromAddress: clientId,
                toAddress: toAddress,
                amount: Number(amount),
                reason: reason,
                timestamp: Date.now(),
                status: 'PENDING'
            });
            
            // Refresh request list
            loadPendingRequests();
            return requestId;
        } catch (error) {
            console.error("Error requesting transfer:", error);
            throw error;
        }
    };

    return (
        <BlockchainContext.Provider value={{
            pendingRequests,
            transactions,
            isLoading,
            requestCoins,
            sendCoins,
            approveRequest,
            rejectRequest,
            getBalance,
            loadGovernmentData,
            loadPendingRequests,
            loadTransactions,
            createAccount: (address, initialBalance = 0) => blockchain ? blockchain.createAccount(address, initialBalance) : false,
            getAllTransactions: () => blockchain ? blockchain.getAllTransactions() : [],
            getPendingRequests: () => blockchain ? blockchain.getPendingRequests() : [],
            resetBlockchain: () => {
                if (blockchain) {
                    blockchain.resetBlockchain();
                    loadPendingRequests();
                    loadTransactions();
                    return true;
                }
                return false;
            },
            requestTransfer
        }}>
            {children}
        </BlockchainContext.Provider>
    );
}; 