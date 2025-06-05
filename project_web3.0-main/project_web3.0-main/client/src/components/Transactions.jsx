import React, { useEffect, useState } from "react";
import { useBlockchain } from "../context/BlockchainContext";
import LoadingIndicator from "./LoadingIndicator";

const Transactions = () => {
  const { 
    transactions, 
    pendingRequests, 
    validateTransaction, 
    validateRequest, 
    getBalance,
    isMining 
  } = useBlockchain();
  const [isGov, setIsGov] = useState(false);

  useEffect(() => {
    const govLoggedIn = localStorage.getItem('govLoggedIn');
    setIsGov(govLoggedIn === 'true');
  }, []);

  const handleValidateTransaction = async (txId, isApproved) => {
    try {
      await validateTransaction(txId, isApproved);
      alert(`Transaction ${isApproved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleValidateRequest = async (requestId, isApproved) => {
    try {
      await validateRequest(requestId, isApproved);
      alert(`Request ${isApproved ? 'approved' : 'rejected'} successfully!`);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <>
      {isMining && <LoadingIndicator />}
      <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
        <div className="flex flex-col md:p-12 py-12 px-4 w-full">
          {/* Pending Requests Section */}
          {isGov && pendingRequests.length > 0 && (
            <div className="bg-[#181918] rounded-lg p-6 mb-8">
              <h2 className="text-2xl text-white mb-4">Pending Coin Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-2 text-left">Client ID</th>
                      <th className="py-2 text-left">Amount</th>
                      <th className="py-2 text-left">Reason</th>
                      <th className="py-2 text-left">Time</th>
                      <th className="py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingRequests.map((request, index) => (
                      <tr key={index} className="border-b border-gray-700">
                        <td className="py-2">{request.fromAddress}</td>
                        <td className="py-2">{request.amount} SWARNIUM</td>
                        <td className="py-2">{request.reason || 'N/A'}</td>
                        <td className="py-2">{new Date(request.timestamp).toLocaleString()}</td>
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleValidateRequest(request.id, true)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleValidateRequest(request.id, false)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Transactions Section */}
          <div className="bg-[#181918] rounded-lg p-6">
            <h2 className="text-2xl text-white mb-4">All Transactions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-2 text-left">Type</th>
                    <th className="py-2 text-left">From</th>
                    <th className="py-2 text-left">To</th>
                    <th className="py-2 text-left">Amount</th>
                    <th className="py-2 text-left">Reason</th>
                    <th className="py-2 text-left">Status</th>
                    <th className="py-2 text-left">Time</th>
                    {isGov && <th className="py-2 text-left">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2">{tx.type}</td>
                      <td className="py-2">{tx.fromAddress}</td>
                      <td className="py-2">{tx.toAddress}</td>
                      <td className="py-2">{tx.amount} SWARNIUM</td>
                      <td className="py-2">{tx.reason || 'N/A'}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded ${
                          tx.status === 'APPROVED' ? 'bg-green-500' :
                          tx.status === 'REJECTED' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2">{new Date(tx.timestamp).toLocaleString()}</td>
                      {isGov && tx.status === 'PENDING' && (
                        <td className="py-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleValidateTransaction(tx.id, true)}
                              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleValidateTransaction(tx.id, false)}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
