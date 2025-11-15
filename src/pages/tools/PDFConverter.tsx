import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, ArrowRight, File, Image, Loader } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';

interface ConversionJob {
  id: string;
  fileName: string;
  fromFormat: string;
  toFormat: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  downloadUrl?: string;
  progress?: number;
}

const PDFConverter = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [conversionJobs, setConversionJobs] = useState<ConversionJob[]>([]);
  const [conversionType, setConversionType] = useState<'to-pdf' | 'from-pdf'>('to-pdf');
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [isProcessing, setIsProcessing] = useState(false);

  const supportedFormats = {
          'to-pdf': [
        { format: 'docx', label: 'Word Document', icon: File },
        { format: 'xlsx', label: 'Excel Spreadsheet', icon: FileText },
        { format: 'pptx', label: 'PowerPoint Presentation', icon: FileText },
        { format: 'jpg', label: 'JPEG Image', icon: Image },
        { format: 'png', label: 'PNG Image', icon: Image },
        { format: 'txt', label: 'Text File', icon: FileText }
      ],
          'from-pdf': [
        { format: 'docx', label: 'Word Document', icon: File },
        { format: 'xlsx', label: 'Excel Spreadsheet', icon: FileText },
        { format: 'jpg', label: 'JPEG Image', icon: Image },
        { format: 'png', label: 'PNG Image', icon: Image },
        { format: 'txt', label: 'Text File', icon: FileText }
      ]
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const simulateConversion = async (file: File) => {
    const jobId = Date.now().toString();
    const newJob: ConversionJob = {
      id: jobId,
      fileName: file.name,
      fromFormat: file.name.split('.').pop() || '',
      toFormat: targetFormat,
      status: 'pending',
      progress: 0
    };

    setConversionJobs(prev => [...prev, newJob]);

    // Simulate processing
    setConversionJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'processing', progress: 0 } : job
    ));

    // Simulate progress updates
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setConversionJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, progress: i } : job
      ));
    }

    // Complete the job
    setConversionJobs(prev => prev.map(job => 
      job.id === jobId ? { 
        ...job, 
        status: 'completed', 
        progress: 100,
        downloadUrl: URL.createObjectURL(file) // Placeholder download URL
      } : job
    ));
  };

  const startConversion = async () => {
    if (files.length === 0) return;
    
    setIsProcessing(true);
    
    // Process files one by one
    for (const file of files) {
      await simulateConversion(file);
    }
    
    setIsProcessing(false);
  };

  const clearFiles = () => {
    setFiles([]);
    setConversionJobs([]);
  };

  const downloadFile = (job: ConversionJob) => {
    if (job.downloadUrl) {
      const link = document.createElement('a');
      link.href = job.downloadUrl;
      link.download = `${job.fileName.split('.')[0]}.${job.toFormat}`;
      link.click();
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6"
          >
            <FileText className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF <span className="text-orange-600">Converter</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert files to and from PDF format with professional quality
          </p>
        </motion.div>

        {/* Conversion Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex justify-center">
            <div className="glass rounded-2xl p-2 inline-flex border border-white/10">
              <button
                onClick={() => setConversionType('to-pdf')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  conversionType === 'to-pdf'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Convert to PDF
              </button>
              <button
                onClick={() => setConversionType('from-pdf')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  conversionType === 'from-pdf'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Convert from PDF
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Files</h2>
            
            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-orange-200 hover:border-orange-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <motion.div
                animate={{ y: dragActive ? -10 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="h-16 w-16 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-400 mb-4">
                  Supports: {supportedFormats[conversionType].map(f => f.format.toUpperCase()).join(', ')}
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept={supportedFormats[conversionType].map(f => `.${f.format}`).join(',')}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-xl cursor-pointer hover:scale-105 transition-transform"
                >
                  Browse Files
                </label>
              </motion.div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Selected Files ({files.length})</h3>
                  <button
                    onClick={clearFiles}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-orange-600" />
                        <span className="text-white text-sm">{file.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Convert Button */}
            {files.length > 0 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startConversion}
                disabled={isProcessing}
                className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Converting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <ArrowRight className="h-5 w-5" />
                    <span>Start Conversion</span>
                  </div>
                )}
              </motion.button>
            )}
          </motion.div>

          {/* Format Selection */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {conversionType === 'to-pdf' ? 'Convert To' : 'Convert From'} Format
            </h2>
            
            <div className="space-y-3">
              {supportedFormats[conversionType].map((format) => (
                <motion.button
                  key={format.format}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTargetFormat(format.format)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    targetFormat === format.format
                      ? 'bg-gradient-to-r from-orange-600 to-orange-600 border-orange-500 text-white'
                      : 'bg-white/5 border-white/20 text-gray-600 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <format.icon className="h-6 w-6" />
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm opacity-70">.{format.format}</div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Conversion Results */}
        {conversionJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversion Results</h2>
            
            <div className="space-y-4">
              {conversionJobs.map((job) => (
                <div key={job.id} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-orange-600" />
                      <span className="text-white font-medium">{job.fileName}</span>
                      <span className="text-gray-400 text-sm">
                        {job.fromFormat.toUpperCase()} → {job.toFormat.toUpperCase()}
                      </span>
                    </div>
                    
                    {job.status === 'completed' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadFile(job)}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </motion.button>
                    )}
                  </div>
                  
                  {job.status === 'processing' && (
                    <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                      <motion.div
                        className="bg-gradient-to-r from-orange-600 to-orange-600 h-2 rounded-full"
                        style={{ width: `${job.progress || 0}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress || 0}%` }}
                      />
                    </div>
                  )}
                  
                  <div className="text-sm">
                    {job.status === 'pending' && <span className="text-yellow-400">Pending</span>}
                    {job.status === 'processing' && <span className="text-blue-400">Processing... {job.progress}%</span>}
                    {job.status === 'completed' && <span className="text-green-400">Completed</span>}
                    {job.status === 'error' && <span className="text-red-400">Error</span>}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isProcessing && <LoadingSpinner text="Converting files..." />}
      </div>
    </div>
  );
};

export default PDFConverter;




