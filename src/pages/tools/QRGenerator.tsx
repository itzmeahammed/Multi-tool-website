import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Download, Upload, Link, Wifi, Phone, Mail, MessageSquare, Home } from 'lucide-react';
import QRCode from 'qrcode';

interface QROptions {
  size: number;
  margin: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  color: {
    dark: string;
    light: string;
  };
}

const QRGenerator = () => {
  const [qrText, setQrText] = useState('');
  const [qrType, setQrType] = useState<'text' | 'url' | 'wifi' | 'phone' | 'email' | 'sms'>('text');
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState<QROptions>({
    size: 400,
    margin: 4,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WiFi specific fields
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Contact specific fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [smsNumber, setSmsNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const qrTypes = [
    { id: 'text', label: 'Text', icon: MessageSquare, description: 'Plain text content' },
    { id: 'url', label: 'URL', icon: Link, description: 'Website links' },
    { id: 'wifi', label: 'WiFi', icon: Wifi, description: 'WiFi credentials' },
    { id: 'phone', label: 'Phone', icon: Phone, description: 'Phone numbers' },
    { id: 'email', label: 'Email', icon: Mail, description: 'Email addresses' },
    { id: 'sms', label: 'SMS', icon: MessageSquare, description: 'Text messages' }
  ];

  const generateQRContent = () => {
    switch (qrType) {
      case 'wifi':
        return `WIFI:T:${wifiSecurity};S:${wifiSSID};P:${wifiPassword};;`;
      case 'phone':
        return `tel:${phoneNumber}`;
      case 'email':
        return `mailto:${emailAddress}`;
      case 'sms':
        return `sms:${smsNumber}?body=${encodeURIComponent(smsMessage)}`;
      default:
        return qrText;
    }
  };

  const generateQR = async () => {
    const content = generateQRContent();
    if (!content.trim()) return;

    setIsGenerating(true);
    try {
      const qrDataURL = await QRCode.toDataURL(content, {
        width: options.size,
        margin: options.margin,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: options.color
      });
      setQrImage(qrDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;
    
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrImage;
    link.click();
  };

  const renderInputFields = () => {
    switch (qrType) {
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Network Name (SSID)</label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter WiFi network name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Password</label>
              <input
                type="password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="Enter WiFi password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Security Type</label>
              <select
                value={wifiSecurity}
                onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white focus:outline-none focus:border-orange-500"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </div>
        );
      case 'phone':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              placeholder="+1234567890"
            />
          </div>
        );
      case 'email':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              placeholder="example@email.com"
            />
          </div>
        );
      case 'sms':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
              <input
                type="tel"
                value={smsNumber}
                onChange={(e) => setSmsNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Message</label>
              <textarea
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                rows={3}
                placeholder="Enter message text"
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {qrType === 'url' ? 'URL' : 'Text Content'}
            </label>
            <textarea
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
              rows={4}
              placeholder={qrType === 'url' ? 'https://example.com' : 'Enter your text here...'}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6"
          >
            <QrCode className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            QR Code <span className="text-orange-600">Generator</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create custom QR codes for text, URLs, WiFi, contacts, and more
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Create QR Code</h2>

            {/* QR Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-4">QR Code Type</label>
              <div className="grid grid-cols-3 gap-3">
                {qrTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQrType(type.id as any)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      qrType === type.id
                        ? 'bg-gradient-to-br from-orange-600 to-orange-600 border-orange-500 text-white'
                        : 'bg-white/5 border-white/20 text-gray-600 hover:border-white/30'
                    }`}
                  >
                    <type.icon className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium text-sm">{type.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="mb-6">
              {renderInputFields()}
            </div>

            {/* Options */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-white">Options</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Size</label>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    value={options.size}
                    onChange={(e) => setOptions({...options, size: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-400">{options.size}px</span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Error Correction</label>
                  <select
                    value={options.errorCorrectionLevel}
                    onChange={(e) => setOptions({...options, errorCorrectionLevel: e.target.value as any})}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Foreground Color</label>
                  <input
                    type="color"
                    value={options.color.dark}
                    onChange={(e) => setOptions({...options, color: {...options.color, dark: e.target.value}})}
                    className="w-full h-10 rounded-lg border border-white/20 bg-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Background Color</label>
                  <input
                    type="color"
                    value={options.color.light}
                    onChange={(e) => setOptions({...options, color: {...options.color, light: e.target.value}})}
                    className="w-full h-10 rounded-lg border border-white/20 bg-transparent"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateQR}
              disabled={isGenerating}
              className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>Generate QR Code</span>
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>
            
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              {qrImage ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="bg-white p-4 rounded-2xl shadow-2xl mb-6 inline-block">
                    <img
                      src={qrImage}
                      alt="Generated QR Code"
                      className="max-w-full h-auto"
                      style={{ maxWidth: '300px' }}
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadQR}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl flex items-center space-x-2 mx-auto"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download QR Code</span>
                  </motion.button>
                </motion.div>
              ) : (
                <div className="text-center">
                  <div className="w-48 h-48 border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center mb-6">
                    <QrCode className="h-16 w-16 text-white/30" />
                  </div>
                  <p className="text-gray-400">Your QR code will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Examples */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Popular QR Code Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Website URL', desc: 'Link to your website or online content', icon: Link },
              { title: 'WiFi Access', desc: 'Share WiFi credentials instantly', icon: Wifi },
              { title: 'Contact Info', desc: 'Phone numbers and email addresses', icon: Phone }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-white/10"
              >
                <item.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default QRGenerator;




