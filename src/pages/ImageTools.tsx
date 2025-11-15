import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Image, 
  FileDown, 
  Crop, 
  Palette, 
  RotateCcw, 
  Download, 
  Upload, 
  ArrowRight,
  Scissors,
  Maximize2,
  Sliders,
  Sparkles
} from 'lucide-react';

const ImageTools = () => {
  const [dragActive, setDragActive] = useState(false);

  const tools = [
    {
      title: "Background Remover",
      description: "Remove backgrounds from images instantly",
      icon: Scissors,
      href: "/tools/background-remover",
      color: "from-red-500 to-pink-500",
      features: ["AI-Powered", "Instant Results", "High Quality", "Batch Processing"],
      popular: true
    },
    {
      title: "Image Compressor",
      description: "Reduce image file size without quality loss",
      icon: FileDown,
      href: "/tools/image-compressor",
      color: "from-blue-500 to-cyan-500",
      features: ["Smart Compression", "Quality Control", "Batch Compress", "Multiple Formats"]
    },
    {
      title: "Image Resizer",
      description: "Resize images to any dimension",
      icon: Maximize2,
      href: "/tools/image-resizer",
      color: "from-green-500 to-teal-500",
      features: ["Custom Sizes", "Maintain Ratio", "Bulk Resize", "Web Optimization"]
    },
    {
      title: "Format Converter",
      description: "Convert between image formats",
      icon: Image,
      href: "/tools/image-converter",
      color: "from-purple-500 to-indigo-500",
      features: ["JPG to PNG", "PNG to JPG", "WebP Support", "SVG Conversion"]
    },
    {
      title: "Image Cropper",
      description: "Crop images with precision",
      icon: Crop,
      href: "/tools/image-cropper",
      color: "from-yellow-500 to-orange-500",
      features: ["Custom Ratios", "Free Form", "Preset Sizes", "Real-time Preview"]
    },
    {
      title: "Image Rotator",
      description: "Rotate and flip images",
      icon: RotateCcw,
      href: "/tools/image-rotator",
      color: "from-pink-500 to-red-500",
      features: ["Any Angle", "Quick Rotate", "Flip Options", "Batch Rotate"]
    },
    {
      title: "Color Enhancer",
      description: "Enhance colors and brightness",
      icon: Palette,
      href: "/tools/color-enhancer",
      color: "from-indigo-500 to-purple-500",
      features: ["Auto Enhance", "Manual Controls", "Filters", "Real-time Preview"]
    },
    {
      title: "Image Filters",
      description: "Apply artistic filters and effects",
      icon: Sliders,
      href: "/tools/image-filters",
      color: "from-teal-500 to-green-500",
      features: ["Vintage Effects", "B&W Filters", "Blur Effects", "Custom Filters"]
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
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
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Image <span className="text-orange-600">Tools</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional image editing tools powered by AI and advanced algorithms
          </p>
        </motion.div>

        {/* Quick Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div
            className={`bg-white rounded-3xl p-8 border-2 border-dashed transition-all duration-300 ${
              dragActive 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-orange-200 hover:border-orange-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <motion.div
                animate={{ y: dragActive ? -10 : 0 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <Image className="h-16 w-16 text-orange-500 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Image Upload
              </h3>
              <p className="text-gray-600 mb-6">
                Support for JPG, PNG, WebP, GIF, and more formats
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl flex items-center space-x-2 mx-auto shadow-lg shadow-orange-500/25"
              >
                <Upload className="h-5 w-5" />
                <span>Select Images</span>
              </motion.button>
            </div>
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
                    whileHover={{ scale: 1.1 }}
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

        {/* Feature Highlight */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-orange-100">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI-Powered Image Processing
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Our advanced AI algorithms ensure the highest quality results for all your image editing needs. 
              From background removal to smart enhancement, experience the future of image processing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Lightning Fast", desc: "Process images in seconds" },
                { title: "High Quality", desc: "Professional-grade results" },
                { title: "Privacy First", desc: "All processing happens locally" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-gray-900 font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ImageTools;