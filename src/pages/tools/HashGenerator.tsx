import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Hash, FileText, UploadCloud, ShieldCheck, ShieldOff } from 'lucide-react';
import CryptoJS from 'crypto-js';

const HashGenerator = () => {
  const [inputType, setInputType] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState({ md5: '', sha1: '', sha256: '' });
  const [hash1, setHash1] = useState('');
  const [hash2, setHash2] = useState('');
  const [match, setMatch] = useState<boolean | null>(null);

  const generateHashesFromText = useCallback((inputText: string) => {
    if (!inputText) {
      setHashes({ md5: '', sha1: '', sha256: '' });
      return;
    }
    const md5 = CryptoJS.MD5(inputText).toString();
    const sha1 = CryptoJS.SHA1(inputText).toString();
    const sha256 = CryptoJS.SHA256(inputText).toString();
    setHashes({ md5, sha1, sha256 });
  }, []);

  const generateHashesFromFile = useCallback((inputFile: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target?.result;
      if (binaryStr) {
        const wordArray = CryptoJS.lib.WordArray.create(binaryStr as any);
        const md5 = CryptoJS.MD5(wordArray).toString();
        const sha1 = CryptoJS.SHA1(wordArray).toString();
        const sha256 = CryptoJS.SHA256(wordArray).toString();
        setHashes({ md5, sha1, sha256 });
      }
    };
    reader.readAsArrayBuffer(inputFile);
  }, []);

  React.useEffect(() => {
    if (inputType === 'text') {
      generateHashesFromText(text);
    }
  }, [text, inputType, generateHashesFromText]);

  React.useEffect(() => {
    if (inputType === 'file' && file) {
      generateHashesFromFile(file);
    }
  }, [file, inputType, generateHashesFromFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const compareHashes = () => {
    if(hash1 && hash2) {
        setMatch(hash1.toLowerCase() === hash2.toLowerCase());
    }
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl mb-6"
          >
            <Hash className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hash <span className="gradient-text-blue">Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate and compare cryptographic hashes from text or files.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <div className="flex space-x-2 mb-6 bg-black/20 p-1 rounded-xl">
              <button onClick={() => setInputType('text')} className={`w-full p-3 rounded-lg transition-colors ${inputType === 'text' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                <FileText className="inline-block mr-2 h-5 w-5" /> Text
              </button>
              <button onClick={() => setInputType('file')} className={`w-full p-3 rounded-lg transition-colors ${inputType === 'file' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                <UploadCloud className="inline-block mr-2 h-5 w-5" /> File
              </button>
            </div>

            {inputType === 'text' ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text here..."
                rows={8}
                className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-blue-400 outline-none"
              />
            ) : (
              <div className="w-full p-8 border-2 border-dashed border-gray-500 rounded-lg text-center">
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">{file ? file.name : 'Click to upload or drag and drop'}</p>
                </label>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 space-y-4"
          >
            <h3 className="text-xl font-bold text-white">MD5:</h3>
            <p className="text-green-400 font-mono break-all bg-black/20 p-2 rounded-lg">{hashes.md5 || '...'}</p>
            <h3 className="text-xl font-bold text-white">SHA1:</h3>
            <p className="text-green-400 font-mono break-all bg-black/20 p-2 rounded-lg">{hashes.sha1 || '...'}</p>
            <h3 className="text-xl font-bold text-white">SHA256:</h3>
            <p className="text-green-400 font-mono break-all bg-black/20 p-2 rounded-lg">{hashes.sha256 || '...'}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 border-2 border-orange-100 mt-8 max-w-4xl mx-auto"
        >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Compare Hashes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input type="text" placeholder="First hash" value={hash1} onChange={e => setHash1(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
                <input type="text" placeholder="Second hash" value={hash2} onChange={e => setHash2(e.target.value)} className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
            </div>
            <div className="text-center mt-4">
                <button onClick={compareHashes} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform">
                    Compare
                </button>
            </div>
            {match !== null && (
                <div className={`mt-4 text-center text-xl font-bold flex items-center justify-center ${match ? 'text-green-400' : 'text-red-400'}`}>
                    {match ? <ShieldCheck className="mr-2" /> : <ShieldOff className="mr-2" />}
                    {match ? 'Hashes Match' : 'Hashes Do Not Match'}
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
};

export default HashGenerator;



