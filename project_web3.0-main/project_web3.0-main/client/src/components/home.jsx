import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen gradient-bg-welcome p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-[#181918] rounded-lg p-6">
          <h1 className="text-4xl text-white font-bold mb-6">Welcome to Swarnium</h1>

          <div className="bg-[#1c1c1c] p-6 rounded-lg mb-6">
            <h2 className="text-2xl text-white mb-4">A Blockchain-Powered Currency</h2>
            <p className="text-gray-400 text-lg mb-4">
              Swarnium is a decentralized digital currency inspired by the Reserve Bank of India’s governance model. Built on a secure blockchain, Swarnium enables fast, transparent, and low-cost transactions for individuals and businesses.
            </p>
            <p className="text-gray-400 text-lg mb-6">
              Explore Swarnium’s features, convert global currencies, learn about blockchain implementations, or start transacting today.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/currency-converter"
                className="bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd] text-center"
              >
                Convert Currency
              </Link>
              <Link
                to="/implementations"
                className="bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd] text-center"
              >
                Explore Implementations
              </Link>
              <Link
                to="/client-login"
                className="bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd] text-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-lg">
            <h2 className="text-2xl text-white mb-4">Why Choose Swarnium?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#181918] p-4 rounded-lg">
                <h3 className="text-white font-bold">Secure Transactions</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Swarnium’s blockchain ensures every transaction is immutable and verifiable, protected by advanced cryptography.
                </p>
              </div>
              <div className="bg-[#181918] p-4 rounded-lg">
                <h3 className="text-white font-bold">Low-Cost Payments</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Send and receive Swarnium with minimal fees, making it ideal for microtransactions and cross-border payments.
                </p>
              </div>
              <div className="bg-[#181918] p-4 rounded-lg">
                <h3 className="text-white font-bold">RBI-Inspired Governance</h3>
                <p className="text-gray-400 text-sm mt-2">
                  Built with regulatory compliance in mind, Swarnium balances decentralization with government oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;