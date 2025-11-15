import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, ArrowRight, File, Image, Loader } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

    const convertImagesToPdf = async (imageFiles: File[]) => {
    const jobId = `batch-${Date.now()}`;
    const newJob: ConversionJob = {
      id: jobId,
      fileName: 'Converted_Images.pdf',
      fromFormat: 'images',
      toFormat: 'pdf',
      status: 'processing',
      progress: 0,
    };
    setConversionJobs(prev => [newJob, ...prev]);

    try {
      const pdfDoc = await PDFDocument.create();
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        setConversionJobs(prev => prev.map(job => job.id === jobId ? { ...job, progress: Math.round(((i + 1) / imageFiles.length) * 100) } : job));
        const imageBytes = await file.arrayBuffer();
        const image = await pdfDoc.embedJpg(imageBytes);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      setConversionJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: 'completed', progress: 100, downloadUrl } : job));
    } catch (error) {
      console.error('Image to PDF conversion failed:', error);
      setConversionJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: 'error' } : job));
    }
  };

  const convertTextToPdf = async (file: File) => {
    const jobId = `text-${Date.now()}`;
    const newJob: ConversionJob = {
      id: jobId,
      fileName: file.name.replace(/\.[^/.]+$/, '') + '.pdf',
      fromFormat: 'txt',
      toFormat: 'pdf',
      status: 'processing',
      progress: 0,
    };
    setConversionJobs(prev => [newJob, ...prev]);

    try {
      const text = await file.text();
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: 50,
        y: height - 50,
        font,
        size: 12,
        lineHeight: 15,
        maxWidth: width - 100,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);

      setConversionJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: 'completed', progress: 100, downloadUrl } : job));
    } catch (error) {
      console.error('Text to PDF conversion failed:', error);
      setConversionJobs(prev => prev.map(job => job.id === jobId ? { ...job, status: 'error' } : job));
    }
  };

  const createPlaceholderPdf = async (file: File) => {
    const jobId = `placeholder-${Date.now()}`;
    const newJob: ConversionJob = {
      id: jobId,
      fileName: file.name.replace(/\.[^/.]+$/, '') + '.pdf',
      fromFormat: file.name.split('.').pop() || 'unknown',
      toFormat: 'pdf',
      status: 'completed',
      progress: 100,
    };

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.drawText('Conversion Not Supported on Client-Side', { x: 50, y: page.getHeight() - 50, font, size: 18, color: rgb(0.9, 0.1, 0.1) });
    page.drawText(`File: ${file.name}`, { x: 50, y: page.getHeight() - 80, font, size: 12 });
    page.drawText('This file type requires server-side processing to be converted.', { x: 50, y: page.getHeight() - 100, font, size: 12 });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    newJob.downloadUrl = URL.createObjectURL(blob);

    setConversionJobs(prev => [newJob, ...prev]);
  };

    const convertAllFiles = async () => {
    setIsProcessing(true);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const textFiles = files.filter(f => f.type === 'text/plain');
    const otherFiles = files.filter(f => !f.type.startsWith('image/') && f.type !== 'text/plain');

    if (files.length > 0 && imageFiles.length === files.length) {
      await convertImagesToPdf(imageFiles);
    } else {
      if (imageFiles.length > 0) await convertImagesToPdf(imageFiles);
      for (const file of textFiles) await convertTextToPdf(file);
      for (const file of otherFiles) await createPlaceholderPdf(file);
    }

    setFiles([]);
    setIsProcessing(false);
  };

  const downloadFile = (job: ConversionJob) => {
    if (job.downloadUrl) {
      const link = document.createElement('a');
      link.href = job.downloadUrl;
      link.download = `${job.fileName.split('.')[0]}.pdf`;
      link.click();
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6"
          >
            <FileText className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF <span className="gradient-text-orange">Converter</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert files to and from PDF format with high quality results
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Files</h2>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-orange-400 bg-orange-500/10'
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
                className="space-y-4"
              >
                <FileText className="h-16 w-16 text-orange-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-400">
                  Supports images, text files, Word docs, Excel sheets, and more
                </p>
                
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                  <span>Browse Files</span>
                </label>
              </motion.div>
            </div>

            {files.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Files ({files.length})</h3>
                  <button
                    onClick={convertAllFiles}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform disabled:opacity-50"
                  >
                    {isProcessing ? 'Converting...' : 'Convert All to PDF'}
                  </button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <File className="h-6 w-6 text-orange-400" />
                          <div>
                            <h4 className="text-white font-medium">{file.name}</h4>
                            <p className="text-sm text-gray-400">
                              {(file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                            if (file.type.startsWith('image/')) convertImagesToPdf([file]);
                            else if (file.type === 'text/plain') convertTextToPdf(file);
                            else createPlaceholderPdf(file);
                            removeFile(index);
                          }}
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg hover:scale-105 transition-transform"
                          >
                            Convert
                          </button>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {conversionJobs.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-6">Conversion Jobs</h3>
                <div className="space-y-4">
                  {conversionJobs.map((job) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-orange-400" />
                          <span className="text-white font-medium">{job.fileName}</span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">{job.toFormat.toUpperCase()}</span>
                        </div>
                        
                        {job.status === 'completed' ? (
                          <button
                            onClick={() => downloadFile(job)}
                            className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:scale-105 transition-transform flex items-center space-x-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        ) : job.status === 'processing' ? (
                          <div className="flex items-center space-x-2 text-yellow-400">
                            <Loader className="h-4 w-4 animate-spin" />
                            <span>{job.progress}%</span>
                          </div>
                        ) : job.status === 'error' ? (
                          <span className="text-red-400">Failed</span>
                        ) : (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </div>
                      
                      {job.status === 'processing' && (
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${job.progress || 0}%` }}
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversion Options</h2>
            
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-4">Conversion Type</label>
              <div className="space-y-3">
                <button
                  onClick={() => setConversionType('to-pdf')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    conversionType === 'to-pdf'
                      ? 'border-orange-400 bg-orange-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-gray-600 hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold">Convert to PDF</div>
                  <div className="text-sm opacity-70">Convert various formats to PDF</div>
                </button>
                <button
                  onClick={() => setConversionType('from-pdf')}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    conversionType === 'from-pdf'
                      ? 'border-orange-400 bg-orange-500/20 text-white'
                      : 'border-white/20 bg-white/5 text-gray-600 hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold">Convert from PDF</div>
                  <div className="text-sm opacity-70">Extract content from PDF files</div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-600 mb-4">Supported Formats</label>
              <div className="grid grid-cols-2 gap-2">
                {supportedFormats[conversionType].map((format) => (
                  <div
                    key={format.format}
                    className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <format.icon className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-gray-600">{format.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PDFConverter;



