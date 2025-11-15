import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  QrCode, 
  Barcode, 
  Palette,
  Hash,
  Key,
  Clock,
  Ruler,
  Zap,
  Globe,
  FileText,
  Link as LinkIcon, 
  ArrowRight,
  Settings,
  Sparkles,
  Calculator

} from 'lucide-react';

const UtilityTools = () => {
  const tools = [
    {
      title: "QR Code Generator",
      description: "Create custom QR codes for text, URLs, and WiFi networks.",
      icon: QrCode,
      href: "/tools/qr-generator",
      color: "from-blue-500 to-cyan-500",
      features: ["Text, URL, WiFi", "PNG & SVG Export", "Customizable", "Real-time Preview"],
      popular: true
    },
    {
      title: "Barcode Generator",
      description: "Generate various barcode formats like UPC, EAN, and Code128.",
      icon: Barcode,
      href: "/tools/barcode-generator",
      color: "from-green-500 to-teal-500",
      features: ["Multiple Formats", "PNG & SVG Export", "Validation", "Custom Dimensions"]
    },
    {
      title: "Password Generator",
      description: "Create strong, secure, and random passwords.",
      icon: Key,
      href: "/tools/password-generator",
      color: "from-red-500 to-pink-500",
      features: ["Custom Length & Sets", "Bulk Generation", "Copy to Clipboard", "High Security"]
    },
    {
      title: "Hash Generator",
      description: "Generate MD5, SHA1, and SHA256 hashes for text or files.",
      icon: Hash,
      href: "/tools/hash-generator",
      color: "from-purple-500 to-indigo-500",
      features: ["MD5, SHA1, SHA256", "Text & File Hashing", "Compare Hashes", "Instant Calculation"]
    },
    {
      title: "Color Picker",
      description: "Pick colors, get palettes, and check contrast ratios.",
      icon: Palette,
      href: "/tools/color-picker",
      color: "from-yellow-500 to-orange-500",
      features: ["HEX, RGB, HSL", "Palette Generation", "Gradient Preview", "WCAG Contrast Check"]
    },
    {
      title: "Unit Converter",
      description: "Convert between various units of measurement.",
      icon: Ruler,
      href: "/tools/unit-converter",
      color: "from-indigo-500 to-blue-500",
      features: ["Length, Weight, Volume", "Temperature", "Speed & Area", "Live Conversion"]
    },
    {
      title: "Currency Converter",
      description: "Real-time exchange rates for over 150 currencies.",
      icon: Globe,
      href: "/tools/currency-converter",
      color: "from-green-500 to-emerald-500",
      features: ["Real-time Rates", "150+ Currencies", "Swap Functionality", "Easy to Use"],
      popular: true
    },
    {
      title: "World Clock",
      description: "View time across different time zones and plan meetings.",
      icon: Clock,
      href: "/tools/world-clock",
      color: "from-pink-500 to-red-500",
      features: ["Multiple Timezones", "Meeting Planner Slider", "Dynamic Add/Remove", "24-hour Format"]
    },
    {
      title: "Base64 Encoder",
      description: "Encode and decode data in Base64 format.",
      icon: Zap,
      href: "/tools/base64-encoder",
      color: "from-cyan-500 to-blue-500",
      features: ["Text & File Support", "URL-Safe Encoding", "Encode & Decode", "Copy to Clipboard"]
    },
    {
      title: "JSON Formatter",
      description: "Validate, format, and minify your JSON data.",
      icon: Settings,
      href: "/tools/json-formatter",
      color: "from-teal-500 to-green-500",
      features: ["Pretty Print & Minify", "Validation & Errors", "Clear & Copy", "Simple Interface"]
    },
    {
      title: "URL Shortener",
      description: "Create short, shareable links and QR codes.",
      icon: LinkIcon,
      href: "/tools/url-shortener",
      color: "from-violet-500 to-purple-500",
      features: ["Instant Shortening", "QR Code Generation", "Copy to Clipboard", "Free to Use"]
    },
    {
      title: "Lorem Ipsum Generator",
      description: "Generate placeholder text for your designs.",
      icon: FileText,
      href: "/tools/lorem-ipsum-generator",
      color: "from-orange-500 to-red-500",
      features: ["Words, Sentences, Paras", "Custom Count", "Instant Generation", "Copy to Clipboard"]
    }
  ];

  const quickTools = [
    { name: "Generate QR Code", icon: QrCode, href: "/tools/qr-generator" },
    { name: "Create Password", icon: Key, href: "/tools/password-generator" },
    { name: "Pick Color", icon: Palette, href: "/tools/color-picker" },
    { name: "Convert Units", icon: Ruler, href: "/tools/unit-converter" },
  ];

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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6"
          >
            <Settings className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Utility <span className="text-orange-600">Tools</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential utilities for everyday productivity - generators, converters, and handy tools
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickTools.map((tool, index) => (
              <Link to={tool.href} key={tool.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-2xl p-4 text-center border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 group h-full flex flex-col justify-center items-center"
                >
                  <tool.icon className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:text-orange-700 transition-colors" />
                  <span className="text-gray-900 text-sm font-medium">{tool.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {tool.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center space-x-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Popular</span>
                </motion.div>
              )}
              
              <Link to={tool.href}>
                <div className="bg-white rounded-2xl p-6 h-full border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl mb-4`}
                  >
                    <tool.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-1 mb-4">
                    {tool.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.02 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors text-sm font-medium"
                    whileHover={{ x: 5 }}
                  >
                    <span>Use Tool</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Utility Categories */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Tool Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Generators",
                tools: ["QR Codes", "Passwords", "Lorem Ipsum", "Barcodes"],
                icon: Zap,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Converters",
                tools: ["Units", "Currency", "Base64", "Colors"],
                icon: Calculator,
                color: "from-green-500 to-teal-500"
              },
              {
                title: "Formatters",
                tools: ["JSON", "XML", "CSS", "SQL"],
                icon: Settings,
                color: "from-orange-500 to-orange-600"
              }
            ].map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center border-2 border-orange-100"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-xl mb-4`}
                >
                  <category.icon className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                <div className="space-y-2">
                  {category.tools.map((tool) => (
                    <div key={tool} className="text-gray-600 text-sm">
                      {tool}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default UtilityTools;