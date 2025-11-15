import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, CheckCircle, XCircle, Copy, Trash2 } from 'lucide-react';

const JSONFormatter = () => {
  const [jsonInput, setJsonInput] = useState('{"example": "json", "data": [1, 2, 3]}');
  const [formattedJson, setFormattedJson] = useState('');
  const [error, setError] = useState('');

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setFormattedJson('');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setFormattedJson(JSON.stringify(parsed));
      setError('');
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setFormattedJson('');
    }
  };

  const handleClear = () => {
      setJsonInput('');
      setFormattedJson('');
      setError('');
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl mb-6">
                <Code className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">JSON <span className="gradient-text-orange">Formatter</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Validate, format, and minify your JSON data with ease.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-medium text-gray-600 mb-2">Input JSON</label>
                    <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)} placeholder='Paste your JSON here...' rows={15} className={`w-full p-3 bg-white/10 rounded-lg border ${error ? 'border-red-500' : 'border-white/20'} text-white font-mono`} />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-600 mb-2">Formatted Output</label>
                    <div className="relative">
                        <textarea readOnly value={formattedJson} placeholder='Formatted JSON will appear here...' rows={15} className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white font-mono" />
                        {formattedJson && <button onClick={() => copyToClipboard(formattedJson)} className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"><Copy size={20}/></button>}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <button onClick={handleFormat} className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform">Pretty Print</button>
                <button onClick={handleMinify} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-xl hover:scale-105 transition-transform">Minify</button>
                <button onClick={handleClear} className="p-3 bg-red-800 text-white rounded-full hover:bg-red-700 transition-colors"><Trash2/></button>
            </div>
            {error && (
                <div className="mt-4 text-center text-red-400 flex items-center justify-center"><XCircle className="mr-2"/>{error}</div>
            )} 
            {!error && formattedJson && (
                <div className="mt-4 text-center text-green-400 flex items-center justify-center"><CheckCircle className="mr-2"/>Valid JSON</div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default JSONFormatter;


