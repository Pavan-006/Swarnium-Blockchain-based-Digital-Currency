import React, { useState } from 'react';

// Hardcoded constants
const PRODUCTION_COST_FACTOR = 0.25; // 25% production cost, only editable in code
const CURRENCIES = [
  { code: 'INR', name: 'Indian Rupee', rateToSwarnium: 100 }, // 1 Swarnium = 100 INR
  { code: 'USD', name: 'US Dollar', rateToSwarnium: 83 }, // 1 Swarnium ≈ 1.2048 USD
  { code: 'EUR', name: 'Euro', rateToSwarnium: 90 }, // 1 Swarnium ≈ 1.1111 EUR
  { code: 'GBP', name: 'British Pound', rateToSwarnium: 105 }, // 1 Swarnium ≈ 0.9524 GBP
  { code: 'JPY', name: 'Japanese Yen', rateToSwarnium: 0.65 }, // 1 Swarnium ≈ 153.8462 JPY
  { code: 'AUD', name: 'Australian Dollar', rateToSwarnium: 55 }, // 1 Swarnium ≈ 1.8182 AUD
  { code: 'CAD', name: 'Canadian Dollar', rateToSwarnium: 60 }, // 1 Swarnium ≈ 1.6667 CAD
  { code: 'CHF', name: 'Swiss Franc', rateToSwarnium: 95 }, // 1 Swarnium ≈ 1.0526 CHF
  { code: 'CNY', name: 'Chinese Yuan', rateToSwarnium: 11.5 }, // 1 Swarnium ≈ 8.6957 CNY
  { code: 'SEK', name: 'Swedish Krona', rateToSwarnium: 8 }, // 1 Swarnium ≈ 12.5 SEK
  { code: 'NZD', name: 'New Zealand Dollar', rateToSwarnium: 50 }, // 1 Swarnium ≈ 2 NZD
];

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  const [direction, setDirection] = useState('toSwarnium'); // 'toSwarnium' or 'fromSwarnium'
  const [result, setResult] = useState(null);

  const handleConvert = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amountValue = parseFloat(amount);
    const currency = CURRENCIES.find((c) => c.code === selectedCurrency);
    let convertedAmount, resultText;

    if (direction === 'toSwarnium') {
      // Convert from currency to Swarnium
      const swarnium = (amountValue / currency.rateToSwarnium) * (1 - PRODUCTION_COST_FACTOR);
      convertedAmount = swarnium.toFixed(3);
      resultText = `${amountValue} ${currency.code} = ${convertedAmount} Swarnium`;
    } else {
      // Convert from Swarnium to currency
      const currencyAmount = amountValue * (currency.rateToSwarnium / (1 - PRODUCTION_COST_FACTOR));
      convertedAmount = currencyAmount.toFixed(3);
      resultText = `${amountValue} Swarnium = ${convertedAmount} ${currency.code}`;
    }

    setResult({
      text: resultText,
      rateInfo: `1 ${currency.code} = ${(1 / currency.rateToSwarnium).toFixed(4)} Swarnium, 1 Swarnium = ${(currency.rateToSwarnium / (1 - PRODUCTION_COST_FACTOR)).toFixed(4)} ${currency.code}`,
    });
  };

  const rupeeFacts = [
    {
      title: 'Managed by RBI',
      description: 'The Indian Rupee (INR) is abbreviated with ₹ and managed by the Reserve Bank of India since 1935.',
    },
    {
      title: 'Production Cost',
      description: 'The RBI spends approximately 2-3 INR to produce a 10 INR note, with costs varying by denomination due to security features.',
    },
    {
      title: 'Subdivision',
      description: 'The Rupee is subdivided into 100 paise, though paise coins are rarely used in modern transactions.',
    },
    {
      title: 'Multilingual Notes',
      description: 'Modern INR notes feature 15 languages on the back, reflecting India’s linguistic diversity.',
    },
    {
      title: 'Plastic Notes',
      description: 'The RBI has trialed plastic notes to enhance durability, potentially reducing long-term production costs.',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg-welcome p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-[#181918] rounded-lg p-6">
          <h2 className="text-2xl text-white mb-6">Currency to Swarnium Converter</h2>

          <div className="bg-[#1c1c1c] p-6 rounded-lg mb-6">
            <form onSubmit={handleConvert} className="space-y-4">
              <div>
                <label className="text-white text-sm">Select Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="w-full p-3 mt-1 rounded bg-white border border-black text-black"
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white text-sm">Conversion Direction</label>
                <div className="flex space-x-4 mt-1">
                  <label className="text-white">
                    <input
                      type="radio"
                      value="toSwarnium"
                      checked={direction === 'toSwarnium'}
                      onChange={(e) => setDirection(e.target.value)}
                      className="mr-2"
                    />
                    {selectedCurrency} to Swarnium
                  </label>
                  <label className="text-white">
                    <input
                      type="radio"
                      value="fromSwarnium"
                      checked={direction === 'fromSwarnium'}
                      onChange={(e) => setDirection(e.target.value)}
                      className="mr-2"
                    />
                    Swarnium to {selectedCurrency}
                  </label>
                </div>
              </div>
              <div>
                <label className="text-white text-sm">Enter Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 mt-1 rounded bg-transparent border border-white text-white"
                  placeholder="e.g., 100"
                  required
                  min="0.001"
                  step="0.001"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#2952e3] text-white py-3 px-4 rounded hover:bg-[#2546bd]"
              >
                Convert
              </button>
            </form>

            {result && (
              <div className="mt-6 text-white">
                <p className="text-lg">{result.text}</p>
                <p className="text-sm text-gray-400 mt-2">{result.rateInfo}</p>
              </div>
            )}
          </div>

          <div className="bg-[#1c1c1c] p-6 rounded-lg mb-6">
            <h3 className="text-xl text-white mb-4">Conversion Rates</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-white">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 text-left">Currency</th>
                    <th className="py-3 text-left">1 Currency = Swarnium</th>
                    <th className="py-3 text-left">1 Swarnium = Currency</th>
                  </tr>
                </thead>
                <tbody>
                  {CURRENCIES.map((currency) => (
                    <tr key={currency.code} className="border-b border-gray-700">
                      <td className="py-3">{currency.name} ({currency.code})</td>
                      <td className="py-3">{(1 / currency.rateToSwarnium).toFixed(4)} Swarnium</td>
                      <td className="py-3">{(currency.rateToSwarnium / (1 - PRODUCTION_COST_FACTOR)).toFixed(4)} {currency.code}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#181918] p-6 rounded-lg">
            <h3 className="text-xl text-white mb-4">Facts About the Indian Rupee</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rupeeFacts.map((fact, index) => (
                <div key={index} className="bg-[#1c1c1c] p-4 rounded-lg">
                  <h4 className="text-white font-bold">{fact.title}</h4>
                  <p className="text-gray-400 text-sm mt-2">{fact.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;