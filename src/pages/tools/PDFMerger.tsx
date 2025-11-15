import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Combine, Upload, Download, FileText, Loader, CheckCircle, ArrowUp, ArrowDown, X } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
  preview?: string;
}

const PDFMerger = () => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type === 'application/pdf'
    );
    
    files.forEach(handlePDFUpload);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handlePDFUpload);
    }
  };

  const handlePDFUpload = async (file: File) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const pdfFile: PDFFile = {
      id,
      file,
      name: file.name,
      size: file.size
    };

    try {
      // Get PDF page count
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      pdfFile.pageCount = pdfDoc.getPageCount();
    } catch (error) {
      console.error('Error loading PDF:', error);
    }

    setPdfFiles(prev => [...prev, pdfFile]);
  };

  const mergePDFs = async () => {
    if (pdfFiles.length < 2) return;

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of pdfFiles) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadMergedPDF = () => {
    if (mergedPdfUrl) {
      const link = document.createElement('a');
      link.href = mergedPdfUrl;
      link.download = 'merged-document.pdf';
      link.click();
    }
  };

  const removePDF = (id: string) => {
    setPdfFiles(prev => prev.filter(pdf => pdf.id !== id));
    if (pdfFiles.length <= 1) {
      setMergedPdfUrl(null);
    }
  };

  const movePDF = (fromIndex: number, toIndex: number) => {
    const newFiles = [...pdfFiles];
    const [removed] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, removed);
    setPdfFiles(newFiles);
    setMergedPdfUrl(null); // Reset merged PDF when order changes
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6"
          >
            <Combine className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            PDF <span className="gradient-text-blue">Merger</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Combine multiple PDF documents into one file with custom ordering
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload PDF Files</h2>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-blue-400 bg-blue-500/10'
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
                <FileText className="h-16 w-16 text-blue-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  Drop PDF files here or click to browse
                </h3>
                <p className="text-gray-400">
                  Upload multiple PDF files to merge them into one document
                </p>
                
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform inline-flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-5 w-5" />
                  <span>Browse PDF Files</span>
                </label>
              </motion.div>
            </div>

            {pdfFiles.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">PDF Files ({pdfFiles.length})</h3>
                  <button
                    onClick={mergePDFs}
                    disabled={pdfFiles.length < 2 || isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Merging...</span>
                      </div>
                    ) : (
                      'Merge PDFs'
                    )}
                  </button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {pdfFiles.map((pdfFile, index) => (
                    <motion.div
                      key={pdfFile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10"
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null && draggedIndex !== index) {
                          movePDF(draggedIndex, index);
                        }
                        setDraggedIndex(null);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex flex-col space-y-1">
                            <span className="text-xs text-gray-400">#{index + 1}</span>
                          </div>
                          <FileText className="h-6 w-6 text-blue-400" />
                          <div>
                            <h4 className="text-white font-medium">{pdfFile.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{formatFileSize(pdfFile.size)}</span>
                              {pdfFile.pageCount && (
                                <>
                                  <span>•</span>
                                  <span>{pdfFile.pageCount} pages</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => movePDF(index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => movePDF(index, Math.min(pdfFiles.length - 1, index + 1))}
                            disabled={index === pdfFiles.length - 1}
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removePDF(pdfFile.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {mergedPdfUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <div>
                      <h4 className="text-white font-medium">PDF Merged Successfully!</h4>
                      <p className="text-sm text-gray-400">
                        Combined {pdfFiles.length} PDF files into one document
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={downloadMergedPDF}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Merge Options</h2>
            
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-white mb-2">Drag & Drop</h3>
                <p className="text-sm text-gray-400">
                  Reorder files by dragging them or using the arrow buttons
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-white mb-2">Custom Order</h3>
                <p className="text-sm text-gray-400">
                  Files will be merged in the order shown in the list
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-white mb-2">Page Selection</h3>
                <p className="text-sm text-gray-400">
                  All pages from each PDF will be included in the merge
                </p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="font-semibold text-white mb-2">Instant Preview</h3>
                <p className="text-sm text-gray-400">
                  See file details and page counts before merging
                </p>
              </div>
            </div>

            {pdfFiles.length > 0 && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h3 className="font-semibold text-white mb-2">Merge Summary</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Files: {pdfFiles.length}</div>
                  <div>Total Pages: {pdfFiles.reduce((sum, pdf) => sum + (pdf.pageCount || 0), 0)}</div>
                  <div>Total Size: {formatFileSize(pdfFiles.reduce((sum, pdf) => sum + pdf.size, 0))}</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PDFMerger;



