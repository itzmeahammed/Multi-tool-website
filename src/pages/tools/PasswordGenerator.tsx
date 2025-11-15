import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Lock, RefreshCw, Clipboard } from 'lucide-react';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [bulkPasswords, setBulkPasswords] = useState<string[]>([]);
  const [bulkCount, setBulkCount] = useState(5);

  const generatePassword = useCallback(() => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    let charset = '';
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === '') {
      setPassword('Please select at least one character set.');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const generateBulkPasswords = () => {
    const passwords = [];
    for (let i = 0; i < bulkCount; i++) {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let charset = '';
        if (includeUppercase) charset += upper;
        if (includeLowercase) charset += lower;
        if (includeNumbers) charset += numbers;
        if (includeSymbols) charset += symbols;
        
        if (charset === '') continue;

        let newPassword = '';
        for (let j = 0; j < length; j++) {
          newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        passwords.push(newPassword);
    }
    setBulkPasswords(passwords);
  };

  React.useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification here
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl mb-6"
          >
            <Lock className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Password <span className="gradient-text-orange">Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create strong, secure, and random passwords for all your accounts.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Secure Password</h2>
            <div className="relative bg-black/20 p-4 rounded-xl flex items-center justify-between">
              <span className="text-white text-lg md:text-xl font-mono break-all mr-4">{password}</span>
              <div className="flex items-center space-x-2">
                <button onClick={() => copyToClipboard(password)} className="p-2 text-gray-600 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <Clipboard className="h-6 w-6" />
                </button>
                <button onClick={generatePassword} className="p-2 text-gray-600 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                  <RefreshCw className="h-6 w-6" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Customization Options</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">Password Length: {length}</label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                  <span className="text-gray-600">ABC</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={includeLowercase} onChange={() => setIncludeLowercase(!includeLowercase)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                  <span className="text-gray-600">abc</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                  <span className="text-gray-600">123</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-yellow-500 focus:ring-yellow-500" />
                  <span className="text-gray-600">#$&</span>
                </label>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Bulk Generate</h2>
            <div className="flex items-center space-x-4 mb-4">
                <label className="text-lg font-medium text-gray-600">Count:</label>
                <input type="number" value={bulkCount} onChange={e => setBulkCount(Math.max(1, parseInt(e.target.value)))} className="w-24 p-2 bg-white/10 rounded-lg border border-white/20 text-white" />
                <button onClick={generateBulkPasswords} className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-red-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
                    Generate
                </button>
            </div>
            {bulkPasswords.length > 0 && (
                <div className="bg-black/20 p-4 rounded-xl space-y-2">
                    {bulkPasswords.map((p, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="text-white font-mono break-all mr-4">{p}</span>
                            <button onClick={() => copyToClipboard(p)} className="p-2 text-gray-600 hover:text-white hover:bg-white/10 rounded-full transition-colors">
                                <Clipboard className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;


