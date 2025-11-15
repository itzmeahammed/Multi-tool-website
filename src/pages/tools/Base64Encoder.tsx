import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, FileText, UploadCloud, Copy } from 'lucide-react';

const Base64Encoder = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isUrlSafe, setIsUrlSafe] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target?.result as string;
        const base64 = btoa(binaryStr);
        setInput(file.name); // Show file name in input
        setOutput(base64);
        setError('');
      };
      reader.readAsBinaryString(file);
    }
  };

  const processText = () => {
    setError('');
    try {
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(input)));
        if (isUrlSafe) {
          encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        }
        setOutput(encoded);
      } else {
        let decodedInput = input;
        if (isUrlSafe) {
            decodedInput = decodedInput.replace(/-/g, '+').replace(/_/g, '/');
            while (decodedInput.length % 4) {
                decodedInput += '=';
            }
        }
        const decoded = decodeURIComponent(escape(atob(decodedInput)));
        setOutput(decoded);
      }
    } catch (e) {
      setError('Invalid input for the selected operation.');
      setOutput('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-700 rounded-2xl mb-6">
                <ArrowRightLeft className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Base64 <span className="gradient-text-gray">Encoder/Decoder</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Encode and decode Base64 strings and files effortlessly.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-4xl mx-auto">
            <div className="flex space-x-2 mb-6 bg-black/20 p-1 rounded-xl">
              <button onClick={() => setMode('encode')} className={`w-full p-3 rounded-lg transition-colors ${mode === 'encode' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                Encode
              </button>
              <button onClick={() => setMode('decode')} className={`w-full p-3 rounded-lg transition-colors ${mode === 'decode' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                Decode
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-lg font-medium text-gray-600 mb-2">Input</label>
                    <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Enter text to ${mode}...`} rows={8} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
                </div>
                <div>
                    <label className="block text-lg font-medium text-gray-600 mb-2">Output</label>
                    <textarea readOnly value={output} placeholder="Result..." rows={8} className="w-full p-3 bg-black/20 rounded-lg border border-white/10 text-white" />
                </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={processText} className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
                        {mode === 'encode' ? 'Encode' : 'Decode'} Text
                    </button>
                    {mode === 'encode' && (
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={isUrlSafe} onChange={() => setIsUrlSafe(!isUrlSafe)} className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-gray-400 focus:ring-gray-500" />
                            <span className="text-gray-600">URL Safe</span>
                        </label>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {mode === 'encode' && (
                        <label htmlFor="file-upload" className="cursor-pointer px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center space-x-2">
                            <UploadCloud size={20}/><span>Encode File</span>
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    )}
                    {output && <button onClick={() => copyToClipboard(output)}><Copy className="h-6 w-6 text-gray-400 hover:text-white"/></button>}
                </div>
            </div>
            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </motion.div>
      </div>
    </div>
  );
};

export default Base64Encoder;


