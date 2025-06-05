import React, { useState } from 'react';
import { FaCode, FaYoutube, FaFilePdf } from 'react-icons/fa';

const Implementations = () => {
  const [expanded, setExpanded] = useState({}); // Track expanded state for implementation cards

  const resources = [
    {
      type: 'implementation',
      title: 'Swarnium for Digital Payments',
      description: 'Swarnium enables fast, secure, and low-cost digital payments, leveraging blockchain for transparency and immutability. Used in peer-to-peer transactions and merchant payments.',
      fullText: 'Swarnium’s blockchain ensures that digital payments are processed with minimal fees compared to traditional banking systems. Each transaction is recorded on an immutable ledger, providing trust and security. The RBI-inspired governance model ensures compliance with regulations, making it suitable for widespread adoption in India and beyond. Use cases include remittances, microtransactions, and cross-border payments.',
    },
    {
      type: 'implementation',
      title: 'Supply Chain Tracking',
      description: 'Swarnium tracks goods across supply chains, ensuring authenticity and reducing fraud. Ideal for industries like agriculture and pharmaceuticals.',
      fullText: 'By integrating Swarnium into supply chain management, businesses can record every step of a product’s journey on the blockchain. This ensures transparency, prevents counterfeiting, and builds consumer trust. For example, farmers can use Swarnium to verify the origin of crops, while pharmaceutical companies can ensure the integrity of medicines. Smart contracts automate verification, reducing manual oversight.',
    },
    {
      type: 'implementation',
      title: 'Secure Voting System',
      description: 'Swarnium powers decentralized voting, ensuring tamper-proof records and voter privacy.',
      fullText: 'Swarnium’s blockchain enables secure, transparent voting systems where each vote is recorded as a transaction. This prevents tampering and ensures auditability. The system uses cryptographic techniques to protect voter privacy while allowing verification of results. It’s ideal for elections, shareholder voting, or community polls, with potential to revolutionize democratic processes.',
    },
    {
      type: 'youtube',
      title: 'Introduction to Blockchain',
      description: 'A beginner-friendly guide to blockchain technology by Simplilearn.',
      url: 'https://www.youtube.com/watch?v=3xGLc-zz9cA',
    },
    {
      type: 'youtube',
      title: 'How Cryptocurrencies Work',
      description: 'TED-Ed explains the mechanics of cryptocurrencies like Swarnium.',
      url: 'https://www.youtube.com/watch?v=kubGCSj5y3k',
    },
    {
      type: 'youtube',
      title: 'Blockchain in India',
      description: 'A look at blockchain adoption in India by TechBit.',
      url: 'https://www.youtube.com/watch?v=placeholder', // Replace with actual link
    },
    {
      type: 'pdf',
      title: 'Swarnium Whitepaper',
      description: 'Detailed technical overview of the Swarnium blockchain.',
      url: 'https://example.com/swarnium-whitepaper.pdf', // Replace with actual PDF URL
    },
    {
      type: 'pdf',
      title: 'Blockchain Facts 2025',
      description: 'Key statistics and trends in blockchain technology.',
      url: 'https://example.com/blockchain-facts-2025.pdf', // Replace with actual PDF URL
    },
    {
      type: 'pdf',
      title: 'RBI and Cryptocurrency',
      description: 'How the RBI regulates digital currencies like Swarnium.',
      url: 'https://example.com/rbi-cryptocurrency.pdf', // Replace with actual PDF URL
    },
  ];

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen gradient-bg-welcome p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-[#181918] rounded-lg p-6">
          <h2 className="text-2xl text-white mb-6">Implementations & Resources</h2>

          <div className="bg-[#1c1c1c] p-6 rounded-lg">
            <h3 className="text-xl text-white mb-4">Explore Swarnium Implementations and Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-[#1c1c1c] p-4 rounded-lg border border-gray-700 hover:border-[#2952e3] transition-colors duration-200"
                >
                  <div className="flex items-center mb-2">
                    {resource.type === 'implementation' && <FaCode className="text-white mr-2" />}
                    {resource.type === 'youtube' && <FaYoutube className="text-white mr-2" />}
                    {resource.type === 'pdf' && <FaFilePdf className="text-white mr-2" />}
                    <h4 className="text-white font-bold">{resource.title}</h4>
                  </div>
                  {resource.type === 'implementation' ? (
                    <div>
                      <p className="text-gray-400 text-sm">
                        {expanded[index]
                          ? resource.fullText
                          : `${resource.description.slice(0, 100)}${
                              resource.description.length > 100 ? '...' : ''
                            }`}
                      </p>
                      {resource.description.length > 100 && (
                        <button
                          onClick={() => toggleExpand(index)}
                          className="text-[#2952e3] hover:text-[#2546bd] text-sm mt-2"
                        >
                          {expanded[index] ? 'Read Less' : 'Read More'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <p className="text-gray-400 text-sm">{resource.description}</p>
                      <span className="text-[#2952e3] hover:text-[#2546bd] text-sm mt-2 inline-block">
                        {resource.type === 'youtube' ? 'Watch Video' : 'View PDF'}
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Implementations;