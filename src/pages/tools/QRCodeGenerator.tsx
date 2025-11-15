import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Wifi, Link as LinkIcon, Type } from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'; // Updated import

const QRCodeGenerator = () => {
  const [qrType, setQrType] = useState<'text' | 'url' | 'wifi'>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const qrRef = useRef<HTMLDivElement>(null);

  const getQrValue = () => {
    switch (qrType) {
      case 'url':
        return url;
      case 'wifi':
        return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
      case 'text':
      default:
        return text;
    }
  };

  const qrValue = getQrValue();

  const downloadQRCode = (format: 'png' | 'svg') => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      const svg = qrRef.current.querySelector('svg');

      if (format === 'png' && canvas) {
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else if (format === 'svg' && svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = "qrcode.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      }
    }
  };

  const renderInputFields = () => {
    switch (qrType) {
      case 'url':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-lg font-medium text-gray-600 mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </motion.div>
        );
      case 'wifi':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-600 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="MyWiFiNetwork"
                className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-600 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="YourPassword"
                className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-600 mb-2">Encryption</label>
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value as any)}
                className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </motion.div>
        );
      case 'text':
      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-lg font-medium text-gray-600 mb-2">Text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter any text to encode"
              rows={4}
              className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </motion.div>
        );
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6"
          >
            <QrCode className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            QR Code <span className="text-orange-600">Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create custom QR codes for text, URLs, WiFi, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-white mb-6">QR Code Content</h2>
            
            <div className="flex space-x-2 mb-6 bg-black/20 p-1 rounded-xl">
              <button onClick={() => setQrType('text')} className={`w-full p-3 rounded-lg transition-colors ${qrType === 'text' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                <Type className="inline-block mr-2 h-5 w-5" /> Text
              </button>
              <button onClick={() => setQrType('url')} className={`w-full p-3 rounded-lg transition-colors ${qrType === 'url' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                <LinkIcon className="inline-block mr-2 h-5 w-5" /> URL
              </button>
              <button onClick={() => setQrType('wifi')} className={`w-full p-3 rounded-lg transition-colors ${qrType === 'wifi' ? 'bg-orange-600 text-white' : 'text-gray-600 hover:bg-white/10'}`}>
                <Wifi className="inline-block mr-2 h-5 w-5" /> WiFi
              </button>
            </div>

            {renderInputFields()}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Generated QR Code</h2>
            
            <div ref={qrRef} className="bg-white p-4 rounded-lg">
              {/* Visible SVG QR Code */}
              <QRCodeSVG
                value={qrValue}
                size={256}
                level={"H"}
                includeMargin={true}
              />
              {/* Hidden Canvas QR Code for PNG download */}
              <QRCodeCanvas
                value={qrValue}
                size={256}
                level={"H"}
                includeMargin={true}
                style={{ display: 'none' }}
              />
            </div>
            
            {qrValue && (
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => downloadQRCode('png')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={() => downloadQRCode('svg')}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>SVG</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;




