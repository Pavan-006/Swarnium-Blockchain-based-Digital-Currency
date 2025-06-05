export class Transaction {
    constructor(fromAddress, toAddress, amount, type = 'TRANSFER', status = 'APPROVED', reason = '') {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
        this.type = type; // 'TRANSFER', 'REQUEST', 'MINT'
        this.status = status; // 'APPROVED', 'REJECTED', 'PENDING'
        this.reason = reason;
        this.id = this.generateId();
        this.hash = null;
        this.signature = null;

        // Immediately calculate hash
        this.initHash();
    }

    generateId() {
        return `TX_${this.fromAddress}_${this.toAddress}_${this.timestamp}`;
    }

    async calculateHash() {
        const data = `${this.fromAddress}${this.toAddress}${this.amount}${this.type}${this.status}${this.timestamp}${this.reason}`;
        const msgBuffer = new TextEncoder().encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async initHash() {
        this.hash = await this.calculateHash();
        console.log(`Transaction created. Hash: ${this.hash}`);
    }

    async sign(privateKey) {
        try {
            // Assuming privateKey is a hex string for ECDSA
            const ec = require('elliptic').ec;
            const secp256k1 = new ec('secp256k1');
            const key = secp256k1.keyFromPrivate(privateKey, 'hex');
            
            if (key.getPublic('hex') !== this.fromAddress) {
                throw new Error('Private key does not match the sender address!');
            }

            const hashTx = await this.calculateHash();
            const sig = key.sign(hashTx, 'base64');
            this.signature = sig.toDER('hex');
            console.log('Transaction signed successfully. Signature:', this.signature);
            return true;
        } catch (error) {
            console.error('Error signing transaction:', error.message);
            throw error;
        }
    }

    async isValid() {
        if (this.fromAddress === null) return true; // For minting transactions
        if (!this.signature || this.signature.length === 0) {
            throw new Error('No signature in this transaction');
        }

        try {
            const ec = require('elliptic').ec;
            const secp256k1 = new ec('secp256k1');
            const publicKey = secp256k1.keyFromPublic(this.fromAddress, 'hex');
            const hashTx = await this.calculateHash();
            const result = publicKey.verify(hashTx, this.signature);
            console.log(`Signature verification ${result ? 'successful' : 'failed'} for transaction ${this.id}`);
            return result;
        } catch (error) {
            console.error('Error verifying signature:', error.message);
            throw error;
        }
    }
}   