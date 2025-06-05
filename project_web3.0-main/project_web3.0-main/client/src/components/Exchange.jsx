import React, { useState } from 'react';

const CurrencyCalculator = () => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [swarniumValue, setSwarniumValue] = useState(0);

    // Conversion rates to Swarnium (you can adjust these as needed)
    const conversionRates = {
        INR: 0.0001,  // 10 INR = 0.001 Swarnium, so 1 INR = 0.0001 Swarnium
        USD: 0.008,   // Example: 1 USD = 0.008 Swarnium
        EUR: 0.009,   // Example: 1 EUR = 0.009 Swarnium
    };

    const calculateSwarnium = () => {
        const inputAmount = parseFloat(amount);
        if (isNaN(inputAmount) || inputAmount < 0) {
            setSwarniumValue(0);
            return;
        }
        const rate = conversionRates[currency];
        const result = inputAmount * rate;
        setSwarniumValue(result.toFixed(4)); // Round to 4 decimal places
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
        calculateSwarnium();
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
        calculateSwarnium();
    };

    const handleRefresh = () => {
        setAmount('');
        setCurrency('INR');
        setSwarniumValue(0);
    };

    return (
        <div className="min-h-screen gradient-bg-welcome p-4">
            <div className="container mx-auto max-w-6xl">
                <div className="bg-[#181918] rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl text-white">Currency Calculator</h2>
                        <button 
                            onClick={handleRefresh}
                            className="bg-[#2952e3] text-white px-4 py-2 rounded hover:bg-[#2546bd]"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Currency Calculator Section */}
                    <div className="mb-6">
                        <h3 className="text-xl text-white mb-4">Convert to Swarnium</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="text-white mb-2 block">Select Currency</label>
                                <select
                                    value={currency}
                                    onChange={handleCurrencyChange}
                                    className="w-full p-2 rounded bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:border-[#2952e3]"
                                >
                                    <option value="INR">INR (Indian Rupee)</option>
                                    <option value="USD">USD (US Dollar)</option>
                                    <option value="EUR">EUR (Euro)</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="text-white mb-2 block">Amount</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    placeholder="Enter amount"
                                    className="w-full p-2 rounded bg-[#2a2a2a] text-white border border-gray-700 focus:outline-none focus:border-[#2952e3]"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <p className="text-white text-lg">
                                {amount || 0} {currency} = <span className="text-green-400">{swarniumValue}</span> SWARNIUM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyCalculator;