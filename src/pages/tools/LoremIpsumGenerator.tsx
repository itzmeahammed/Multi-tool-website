import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Check } from 'lucide-react';

const loremIpsumWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'a', 'ac', 'accumsan', 'ad', 'aenean', 'aliquam', 'aliquet', 'ante', 'aptent', 'arcu', 'at', 'auctor', 'augue', 'aut', 'bibendum', 'blandit', 'class', 'commodo', 'condimentum', 'congue', 'consequat', 'conubia', 'convallis', 'cras', 'cubilia', 'cum', 'curabitur', 'curae', 'cursus', 'dapibus', 'diam', 'dictum', 'dictumst', 'dignissim', 'dis', 'donec', 'dui', 'duis', 'efficitur', 'egestas', 'eget', 'eleifend', 'elementum', 'enim', 'erat', 'eros', 'est', 'et', 'etiam', 'eu', 'euismod', 'ex', 'facilisi', 'facilisis', 'fames', 'faucibus', 'felis', 'fermentum', 'feugiat', 'finibus', 'firmissimis', 'fringilla', 'fusce', 'gloria', 'gracili', 'gravida', 'habitant', 'habitasse', 'hac', 'hendrerit', 'hymenaeos', 'iaculis', 'id', 'imperdiet', 'in', 'inceptos', 'integer', 'interdum', 'ipsum', 'iusto', 'lacinia', 'lacus', 'laoreet', 'lectus', 'leo', 'libero', 'ligula', 'litora', 'lobortis', 'luctus', 'maecenas', 'magna', 'magnis', 'malesuada', 'marcidus', 'massa', 'mattis', 'mauris', 'maximus', 'metus', 'mi', 'molestie', 'mollis', 'montes', 'morbi', 'mus', 'nam', 'nascetur', 'natoque', 'nec', 'neque', 'netus', 'nibh', 'nisi', 'nisl', 'non', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci', 'ornare', 'parturient', 'pellentesque', 'penatibus', 'per', 'pharetra', 'phasellus', 'placerat', 'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium', 'primis', 'proin', 'pulvinar', 'purus', 'quam', 'qui', 'quis', 'quisque', 'rhoncus', 'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'sed', 'sem', 'semper', 'senectus', 'sociis', 'sociosqu', 'sodales', 'sollicitudin', 'sperne', 'squalore', 'sponte', 'statu', 'sua', 'suavitate', 'sub', 'suscipit', 'suspendisse', 'taciti', 'tellus', 'tempor', 'tempus', 'tincidunt', 'torquent', 'tortor', 'tristique', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'una', 'urna', 'ut', 'varius', 'vehicula', 'vel', 'velit', 'venenatis', 'vestibulum', 'viae', 'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate'
];

const LoremIpsumGenerator = () => {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
    const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

    const generateText = useCallback(() => {
    const randomWord = () => loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)];

    const generateSentence = (wordCount: number) => {
      const sentence = Array.from({ length: wordCount }, randomWord).join(' ');
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    };

    const generateParagraph = () => {
      const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
      return Array.from({ length: sentenceCount }, () => generateSentence(Math.floor(Math.random() * 8) + 8)).join(' '); // 8 to 15 words
    };

    let result = '';
    switch (type) {
      case 'words':
        result = Array.from({ length: count }, randomWord).join(' ');
        break;
      case 'sentences':
        result = Array.from({ length: count }, () => generateSentence(Math.floor(Math.random() * 8) + 8)).join(' ');
        break;
      case 'paragraphs':
        result = Array.from({ length: count }, generateParagraph).join('\n\n');
        break;
    }
    setGeneratedText(result);
  }, [type, count]);

  React.useEffect(() => {
    generateText();
  }, [generateText]);

    const copyToClipboard = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-2xl mb-6">
            <FileText className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Lorem Ipsum <span className="gradient-text-sky">Generator</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Generate placeholder text for your design mockups.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
            <select value={type} onChange={e => setType(e.target.value as any)} className="p-3 bg-white/10 rounded-lg border border-white/20 text-white">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, parseInt(e.target.value)))} className="w-24 p-3 bg-white/10 rounded-lg border border-white/20 text-white" />
            <button onClick={generateText} className="px-6 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform">Generate</button>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={generatedText}
              rows={12}
              className="w-full p-4 bg-black/20 rounded-lg border border-white/10 text-gray-600 leading-relaxed"
            />
                        <button onClick={copyToClipboard} className={`absolute top-3 right-3 p-2 rounded-lg transition-all ${copied ? 'bg-green-500/20 text-green-400' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoremIpsumGenerator;


