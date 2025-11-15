import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Barcode, Download } from 'lucide-react';
import JsBarcode from 'jsbarcode';

const BarcodeGenerator = () => {
  const [text, setText] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [isValid, setIsValid] = useState(true);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const barcodeFormats = [
    'CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14', 'MSI', 'pharmacode', 'codabar'
  ];

  const handleGenerate = () => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, text, {
          format: format,
          lineColor: '#ffffff',
          width: 2,
          height: 100,
          displayValue: true,
          fontOptions: 'bold',
          font: 'monospace',
          fontSize: 18,
          background: 'transparent',
          margin: 10,
        });
        setIsValid(true);
      } catch (e) {
        setIsValid(false);
        console.error(e);
      }
    }
  };

  React.useEffect(() => {
    handleGenerate();
  }, [text, format]);

  const downloadBarcode = (fileFormat: 'png' | 'svg') => {
    if (barcodeRef.current && isValid) {
      const svgElement = barcodeRef.current;
      const svgData = new XMLSerializer().serializeToString(svgElement);

      if (fileFormat === 'svg') {
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `barcode-${text}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
      } else if (fileFormat === 'png') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `barcode-${text}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mb-6"
          >
            <Barcode className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Barcode <span className="gradient-text-green">Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate various barcode formats for your products and assets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Barcode Data</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">Data to Encode</label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter data for barcode"
                  className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-teal-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-600 mb-2">Barcode Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full p-3 bg-white/10 rounded-lg border border-white/20 text-white focus:ring-2 focus:ring-teal-400 outline-none"
                >
                  {barcodeFormats.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 flex flex-col items-center justify-center"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Generated Barcode</h2>
            
            <div className="bg-white p-4 rounded-lg w-full flex justify-center">
              {isValid ? (
                <svg ref={barcodeRef}></svg>
              ) : (
                <div className="text-red-500 text-center">
                  <p>Invalid input for the selected barcode type.</p>
                  <p className="text-sm">Please check the format requirements.</p>
                </div>
              )}
            </div>
            
            {isValid && (
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => downloadBarcode('png')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>PNG</span>
                </button>
                <button
                  onClick={() => downloadBarcode('svg')}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
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

export default BarcodeGenerator;


