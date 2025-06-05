import { Block } from './Block';
import { Transaction } from './Transaction';

export class Blockchain {
    constructor() {
        // Try to load existing blockchain from localStorage
        const savedState = this.loadFromStorage();
        
        if (savedState) {
            // Restore from saved state
            this.chain = savedState.chain;
            this.difficulty = savedState.difficulty;
            this.pendingTransactions = savedState.pendingTransactions;
            this.pendingRequests = savedState.pendingRequests;
            this.balances = new Map(savedState.balances);
            console.log("Blockchain loaded from storage");
        } else {
            // Initialize new blockchain
            this.chain = [this.createGenesisBlock()];
            this.difficulty = 2;
            this.pendingTransactions = [];
            this.pendingRequests = [];
            this.balances = new Map();
            
            // Initialize balances
            this.initializeBalances();
            console.log("New blockchain initialized");
        }
    }
    
    // Save current state to localStorage
    saveToStorage() {
        try {
            const state = {
                chain: this.chain,
                difficulty: this.difficulty,
                pendingTransactions: this.pendingTransactions,
                pendingRequests: this.pendingRequests,
                balances: Array.from(this.balances.entries())
            };
            localStorage.setItem('blockchain_state', JSON.stringify(state));
            console.log("Blockchain saved to storage");
            return true;
        } catch (error) {
            console.error("Failed to save blockchain:", error);
            return false;
        }
    }
    
    // Load blockchain from localStorage
    loadFromStorage() {
        try {
            const savedState = localStorage.getItem('blockchain_state');
            if (!savedState) return null;
            
            const state = JSON.parse(savedState);
            return state;
        } catch (error) {
            console.error("Failed to load blockchain:", error);
            return null;
        }
    }

    // Reset blockchain (for testing)
    resetBlockchain() {
        localStorage.removeItem('blockchain_state');
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.pendingRequests = [];
        this.balances = new Map();
        this.initializeBalances();
        console.log("Blockchain reset");
    }

    initializeBalances() {
        // Initial supply for government
        this.balances.set('government', 1000000); // 1 million Swarium
        // Create some test accounts
        this.balances.set('client1', 0);
        this.balances.set('client2', 0);
        this.balances.set('client3', 0);
        this.saveToStorage();
    }

    createGenesisBlock() {
        const block = new Block(Date.now(), [], "0");
        block.hash = "0"; // Genesis block has a fixed hash
        return block;
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    async minePendingTransactions() {
        try {
            // Check if there are any approved transactions
            const approvedTransactions = this.pendingTransactions
                .filter(tx => tx.status === 'APPROVED');
                
            // Debug logging
            console.log("Approved transactions to mine:", approvedTransactions.length);
            
            if (approvedTransactions.length === 0) {
                console.log("No approved transactions to mine");
                return;
            }

            console.log("Mining new block with transactions:", approvedTransactions);
            const block = new Block(
                Date.now(),
                approvedTransactions,
                this.getLatestBlock().hash
            );

            // Show mining notification
            this.onMiningStart?.();

            // Mine the block
            await block.mineBlock(this.difficulty);

            // Add the mined block to the chain
            this.chain.push(block);

            // Clear mined transactions from pending
            this.pendingTransactions = this.pendingTransactions.filter(tx => tx.status !== 'APPROVED');

            // Notify mining completion
            this.onMiningComplete?.();
            
            // Debug: Check if transactions are in the chain
            const allTxs = this.getAllTransactions();
            console.log("All transactions after mining:", allTxs.length, allTxs);
            
            // Save updated state
            this.saveToStorage();

            console.log("Block added to chain:", block);
            return block;
        } catch (error) {
            console.error("Mining error:", error);
            this.onMiningError?.(error);
            throw error;
        }
    }

    async addTransaction(transaction) {
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include from and to address');
        }

        this.pendingTransactions.push(transaction);
        this.saveToStorage();
        return transaction.id;
    }

    async validateTransaction(transactionId, isApproved) {
        try {
            const transaction = this.pendingTransactions.find(t => t.id === transactionId);
            if (!transaction) {
                throw new Error('Transaction not found');
            }

            if (isApproved) {
                transaction.status = 'APPROVED';
                const fromBalance = this.balances.get(transaction.fromAddress) || 0;
                const toBalance = this.balances.get(transaction.toAddress) || 0;

                if (fromBalance >= transaction.amount) {
                    // Update balances
                    this.balances.set(transaction.fromAddress, fromBalance - transaction.amount);
                    this.balances.set(transaction.toAddress, toBalance + transaction.amount);
                    
                    // Mine new block asynchronously
                    await this.minePendingTransactions();
                    this.saveToStorage();
                    return true;
                } else {
                    throw new Error('Insufficient balance');
                }
            } else {
                transaction.status = 'REJECTED';
                this.pendingTransactions = this.pendingTransactions.filter(t => t.id !== transactionId);
                this.saveToStorage();
            }
            return true;
        } catch (error) {
            console.error('Validation error:', error);
            throw error;
        }
    }

    async validateRequest(requestId, isApproved) {
        try {
            console.log("Validating request:", requestId, "isApproved:", isApproved);
            
            const request = this.pendingRequests.find(r => r.id === requestId);
            if (!request) {
                throw new Error('Request not found');
            }

            // First, remove the request from pending before doing anything else
            // This ensures it's gone even if there's an error later
            const requestIndex = this.pendingRequests.findIndex(r => r.id === requestId);
            if (requestIndex !== -1) {
                this.pendingRequests.splice(requestIndex, 1);
                console.log("Removed request from pending:", requestId);
            }
            
            // Save after removing the request
            this.saveToStorage();

            if (isApproved) {
                // Check if this is a TRANSFER type request (client-to-client)
                if (request.type === 'TRANSFER') {
                    console.log("Processing client-to-client transfer request:", request);
                    
                    const fromBalance = this.balances.get(request.fromAddress) || 0;
                    const toBalance = this.balances.get(request.toAddress) || 0;
                    
                    if (fromBalance >= request.amount) {
                        // Update balances for client-to-client transfer
                        this.balances.set(request.fromAddress, fromBalance - request.amount);
                        this.balances.set(request.toAddress, toBalance + request.amount);
                        
                        console.log("Creating approved client-to-client transaction");
                        
                        // Create transaction record with APPROVED status
                        const transaction = new Transaction(
                            request.fromAddress,
                            request.toAddress,
                            request.amount,
                            'TRANSFER',
                            'APPROVED',
                            request.reason
                        );
                        
                        // Store the original request ID in the transaction
                        transaction.originalRequestId = request.id;
                        console.log("Created transaction:", transaction);
                        
                        // Add to pending transactions
                        await this.addTransaction(transaction);
                        
                        // Mine the transaction immediately
                        const block = await this.minePendingTransactions();
                        
                        // Save the updated state
                        this.saveToStorage();
                        
                        console.log(`Transfer request ${requestId} approved and mined in block:`, block);
                        return true;
                    } else {
                        throw new Error('Insufficient balance for transfer');
                    }
                } else {
                    // Original code for coin requests (MINT type)
                    const fromBalance = this.balances.get('government') || 0;
                    const toBalance = this.balances.get(request.fromAddress) || 0;

                    if (fromBalance >= request.amount) {
                        // Update balances
                        this.balances.set('government', fromBalance - request.amount);
                        this.balances.set(request.fromAddress, toBalance + request.amount);
                        
                        console.log("Creating approved transaction for request:", requestId);
                        
                        // Create transaction record with APPROVED status
                        const transaction = new Transaction(
                            'government',
                            request.fromAddress,
                            request.amount,
                            'Sanction   ',
                            'APPROVED', // Explicitly set to APPROVED
                            request.reason
                        );
                        
                        // Store the original request ID in the transaction
                        transaction.originalRequestId = request.id;
                        console.log("Created transaction:", transaction);
                        
                        // Add to pending transactions
                        await this.addTransaction(transaction);
                        
                        // Debug: Check transactions before mining
                        console.log("Pending transactions before mining:", 
                            this.pendingTransactions.length,
                            this.pendingTransactions
                        );
                        
                        // Mine the transaction immediately
                        const block = await this.minePendingTransactions();
                        
                        // Save the updated state
                        this.saveToStorage();
                        
                        // Debug: Final check of all transactions
                        const allTxAfter = this.getAllTransactions();
                        console.log("All transactions after approval:", allTxAfter.length, allTxAfter);
                        
                        console.log(`Request ${requestId} approved and mined in block:`, block);
                        return true;
                    } else {
                        throw new Error('Insufficient government balance');
                    }
                }
            }
            return true;
        } catch (error) {
            console.error('Request validation error:', error);
            throw error;
        }
    }

    addRequest(request) {
        // Generate a unique ID for the request if it doesn't have one
        if (!request.id) {
            request.id = `REQ_${request.fromAddress}_${Date.now()}`;
        }
        // Ensure status is set
        if (!request.status) {
            request.status = 'PENDING';
        }
        // Add timestamp if not present
        if (!request.timestamp) {
            request.timestamp = Date.now();
        }
        this.pendingRequests.push(request);
        this.saveToStorage();
        return request.id;
    }

    getBalance(address) {
        return this.balances.get(address) || 0;
    }

    // Create a new account with initial balance
    createAccount(address, initialBalance = 0) {
        if (!this.balances.has(address)) {
            this.balances.set(address, initialBalance);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getAllTransactions() {
        // Get transactions from the blockchain chain
        const chainTransactions = this.chain.flatMap(block => block.transactions);
        
        // Also include pending transactions that are approved
        const approvedPendingTransactions = this.pendingTransactions.filter(tx => 
            tx.status === 'APPROVED'
        );
        
        // Combine both sets of transactions
        return [...chainTransactions, ...approvedPendingTransactions];
    }

    getPendingTransactions() {
        return this.pendingTransactions;
    }

    getPendingRequests() {
        return this.pendingRequests;
    }

    // Create a transfer request that needs government approval
    addTransferRequest(request) {
        // Generate a unique ID for the request if it doesn't have one
        if (!request.id) {
            request.id = `TRANSFER_REQ_${request.fromAddress}_${request.toAddress}_${Date.now()}`;
        }
        // Ensure status is set
        if (!request.status) {
            request.status = 'PENDING';
        }
        // Add timestamp if not present
        if (!request.timestamp) {
            request.timestamp = Date.now();
        }
        // Set type to TRANSFER
        request.type = 'TRANSFER';
        
        // Add to pending requests
        this.pendingRequests.push(request);
        this.saveToStorage();
        return request.id;
    }
} 