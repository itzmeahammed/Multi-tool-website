import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  File, 
  Image, 
  Combine, 
  Split, 
  FileDown, 
  RotateCcw,
  Download,
  Upload,
  ArrowRight
} from 'lucide-react';

const DocumentTools = () => {
  const [dragActive, setDragActive] = useState(false);

  const tools = [
    {
      title: "PDF Converter",
      description: "Convert files to and from PDF format",
      icon: FileText,
      href: "/tools/pdf-converter",
      color: "from-red-500 to-orange-500",
      features: ["Word to PDF", "Excel to PDF", "PowerPoint to PDF", "Images to PDF"]
    },
    {
      title: "PDF Merger",
      description: "Combine multiple PDFs into one document",
      icon: Combine,
      href: "/tools/pdf-merger",
      color: "from-blue-500 to-cyan-500",
      features: ["Drag & Drop", "Custom Order", "Page Selection", "Instant Preview"]
    },
    {
      title: "PDF Splitter",
      description: "Split PDF into multiple documents",
      icon: Split,
      href: "/tools/pdf-splitter",
      color: "from-green-500 to-teal-500",
      features: ["Split by Pages", "Extract Pages", "Split by Size", "Batch Processing"]
    },
    {
      title: "PDF Compressor",
      description: "Reduce PDF file size without quality loss",
      icon: FileDown,
      href: "/tools/pdf-compressor",
      color: "from-purple-500 to-pink-500",
      features: ["Smart Compression", "Quality Control", "Batch Compress", "Size Preview"]
    },
    {
      title: "Word Processor",
      description: "Convert and edit Word documents",
      icon: File,
      href: "/tools/word-processor",
      color: "from-indigo-500 to-blue-500",
      features: ["DOCX to PDF", "DOC to DOCX", "Text Extraction", "Format Converter"]
    },
    {
      title: "Excel Tools",
      description: "Work with spreadsheets and data",
      icon: FileText,
      href: "/tools/excel-tools",
      color: "from-emerald-500 to-green-500",
      features: ["XLS to XLSX", "CSV Converter", "Data Export", "Format Tools"]
    },
    {
      title: "Document Rotator",
      description: "Rotate pages in your documents",
      icon: RotateCcw,
      href: "/tools/document-rotator",
      color: "from-yellow-500 to-orange-500",
      features: ["Rotate Pages", "Batch Rotate", "Custom Angles", "PDF Rotation"]
    },
    {
      title: "Format Converter",
      description: "Convert between various document formats",
      icon: Image,
      href: "/tools/format-converter",
      color: "from-pink-500 to-red-500",
      features: ["Multi-Format", "Batch Convert", "Quality Control", "Fast Processing"]
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
    // Handle file drop
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
            Document <span className="text-orange-600">Tools</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful document processing tools for PDF conversion, merging, splitting, and more
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
                <Upload className="h-16 w-16 text-orange-500 mx-auto" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick File Upload
              </h3>
              <p className="text-gray-600 mb-6">
                Drag and drop your documents here or click to select files
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl flex items-center space-x-2 mx-auto shadow-lg shadow-orange-500/25"
              >
                <Upload className="h-5 w-5" />
                <span>Select Files</span>
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
              className="group"
            >
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

        {/* Popular Tools Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Most Popular Document Tools
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['PDF to Word', 'Word to PDF', 'Merge PDF', 'Compress PDF', 'Split PDF'].map((tool, index) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-3 bg-white rounded-full border-2 border-orange-200 text-gray-900 font-medium hover:border-orange-500 hover:text-orange-600 transition-all cursor-pointer"
              >
                {tool}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default DocumentTools;