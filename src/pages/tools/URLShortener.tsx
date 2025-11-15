import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Copy, Send } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react'; // Updated import

const API_ENDPOINT = 'https://ulvis.net/api.php?url=';

const URLShortener = () => {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShorten = async () => {
    if (!longUrl) {
      setError('Please enter a URL.');
      return;
    }
    setLoading(true);
    setError('');
    setShortUrl('');

    try {
      const response = await fetch(`${API_ENDPOINT}${encodeURIComponent(longUrl)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      const text = await response.text();
      // The API returns plain text, so we use it directly.
      setShortUrl(text);
    } catch (e) {
      setError('Failed to shorten URL. Please try again.');
      console.error(e);
    }
    setLoading(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-fuchsia-500 rounded-2xl mb-6">
            <Link className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">URL <span className="gradient-text-rose">Shortener</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Create short, shareable links in an instant.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="url"
              value={longUrl}
              onChange={e => setLongUrl(e.target.value)}
              placeholder="https://your-very-long-url.com/goes-here"
              className="w-full p-4 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-rose-400 outline-none"
            />
            <button
              onClick={handleShorten}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Send size={20} />
              <span>{loading ? 'Shortening...' : 'Shorten'}</span>
            </button>
          </div>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
          {shortUrl && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-8 text-center">
              <h2 className="text-xl font-bold text-white mb-4">Your Short Link:</h2>
              <div className="bg-black/20 p-4 rounded-xl flex flex-col md:flex-row items-center justify-center gap-4">
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-2xl text-rose-300 font-bold hover:underline">{shortUrl}</a>
                <button onClick={() => copyToClipboard(shortUrl)} className="p-2 text-gray-600 hover:text-white"><Copy /></button>
              </div>
              <div className="mt-6 bg-white p-4 inline-block rounded-lg">
                <QRCodeSVG 
                  value={shortUrl} 
                  size={128} 
                  level={"H"} 
                  includeMargin={true} 
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default URLShortener;

