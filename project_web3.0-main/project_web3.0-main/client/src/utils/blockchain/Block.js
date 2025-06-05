export class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = '';
    }

    async calculateHash() {
        const data = 
            this.previousHash + 
            this.timestamp + 
            JSON.stringify(this.transactions) + 
            this.nonce;
            
        // Using a simple hash function for demonstration
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    async mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        
        while (true) {
            this.hash = await this.calculateHash();
            if (this.hash.substring(0, difficulty) === target) {
                break;
            }
            this.nonce++;
            
            // Add a small delay to prevent browser freezing
            if (this.nonce % 100 === 0) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        console.log("Block mined:", this.hash);
        return this.hash;
    }
} 