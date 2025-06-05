import React, { useEffect, useState } from "react";
import { useBlockchain } from "../context/BlockchainContext";

export const TransactionContext = React.createContext();

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = useState({ addressTo: "", amount: "", keyword: "", message: "" });
  const [currentAccount, setCurrentAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const blockchainContext = useBlockchain();
  const blockchain = blockchainContext?.blockchain;

  useEffect(() => {
    // Initialize transactions when blockchain is ready
    if (blockchain) {
      getAllTransactions();
      checkIfTransactionsExists();
    }
  }, [blockchain]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (!blockchain) return;
      const availableTransactions = blockchain.getAllTransactions();
      const structuredTransactions = availableTransactions.map((transaction) => ({
        addressTo: transaction.toAddress,
        addressFrom: transaction.fromAddress,
        timestamp: new Date(transaction.timestamp).toLocaleString(),
        message: transaction.reason,
        keyword: transaction.type,
        amount: transaction.amount
      }));
      setTransactions(structuredTransactions);
    } catch (error) {
      console.error("Error getting transactions:", error);
    }
  };

  const checkIfWalletIsConnect = async () => {
    try {
      const clientId = localStorage.getItem('clientId');
      if (clientId && blockchain) {
        setCurrentAccount(clientId);
        getAllTransactions();
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const checkIfTransactionsExists = async () => {
    try {
      if (!blockchain) return;
      const allTransactions = blockchain.getAllTransactions();
      setTransactionCount(allTransactions.length);
    } catch (error) {
      console.error("Error checking transactions:", error);
    }
  };

  const sendTransaction = async () => {
    try {
      if (!blockchain) return;
      const { addressTo, amount, keyword, message } = formData;
      const transaction = new Transaction(
        currentAccount,
        addressTo,
        Number(amount),
        'TRANSFER',
        'PENDING',
        message
      );
      blockchain.addTransaction(transaction);
      setIsLoading(false);
      getAllTransactions();
      checkIfTransactionsExists();
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
        getAllTransactions,
        checkIfWalletIsConnect,
        checkIfTransactionsExists
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
