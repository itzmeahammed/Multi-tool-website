import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';

const API_URL = 'https://api.exchangerate-api.com/v4/latest/';

const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}${fromCurrency}`)
      .then(res => res.json())
      .then(data => {
        setRates(data.rates);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching rates:", error);
        setLoading(false);
      });
  }, [fromCurrency]);

  const convertedAmount = useMemo(() => {
    if (!rates[toCurrency] || !amount) return '...';
    const rate = rates[toCurrency];
    const result = parseFloat(amount) * rate;
    return result.toFixed(4);
  }, [amount, toCurrency, rates]);

  const currencyList = useMemo(() => Object.keys(rates).sort(), [rates]);

  const handleSwapCurrencies = () => {
      const temp = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(temp);
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-lime-500 rounded-2xl mb-6">
                <Landmark className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Currency <span className="gradient-text-emerald">Converter</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Real-time exchange rates for over 150 currencies.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-2xl mx-auto">
            {loading ? (
                <div className="text-center text-white">Loading rates...</div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-lg font-medium text-gray-600 mb-2">Amount</label>
                            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
                        </div>
                        <div className="md:col-span-1">
                             <label className="block text-lg font-medium text-gray-600 mb-2">From</label>
                            <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                                {currencyList.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-1">
                             <label className="block text-lg font-medium text-gray-600 mb-2">To</label>
                            <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white">
                                {currencyList.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-400 text-lg">{amount} {fromCurrency} =</p>
                        <p className="text-4xl font-bold text-emerald-300 my-2">{convertedAmount} {toCurrency}</p>
                        <p className="text-gray-500">1 {toCurrency} = {(1 / (rates[toCurrency] || 1)).toFixed(6)} {fromCurrency}</p>
                    </div>
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default CurrencyConverter;


