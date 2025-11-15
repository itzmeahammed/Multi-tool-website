import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileDown, Upload, Loader, CheckCircle } from 'lucide-react';
import { PDFDocument, PDFName, PDFRawStream, PDFDict } from 'pdf-lib';

const PDFCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressedUrl(null);
      setCompressedSize(0);
      setError(null);
    }
  };

    const compressPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();
      let imageReplaced = false;

      for (const page of pages) {
        const resources = page.node.Resources();
        const xobjects = resources?.get(PDFName.of('XObject'));
        if (!(xobjects instanceof PDFDict)) continue;

        for (const name of xobjects.keys()) {
          const imageStream = xobjects.get(name);
          if (imageStream instanceof PDFRawStream && imageStream.dict.get(PDFName.of('Subtype')) === PDFName.of('Image')) {
            try {
              const imageBytes = imageStream.contents;
              const embeddedImage = await pdfDoc.embedJpg(imageBytes);
              xobjects.set(name, embeddedImage.ref);
              imageReplaced = true;
            } catch (imgError) {
              console.warn('Could not re-embed an image (it may not be a JPG), skipping.', imgError);
            }
          }
        }
      }

      if (!imageReplaced) {
        setError('No compatible JPG images found to compress.');
        setIsProcessing(false);
        return;
      }

      const compressedBytes = await pdfDoc.save({ useObjectStreams: false });
      const blob = new Blob([compressedBytes], { type: 'application/pdf' });
      setCompressedSize(blob.size);
      setCompressedUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError('Failed to compress PDF. The file may be corrupt or protected.');
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
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
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6">
            <FileDown className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">PDF Compressor</h1>
          <p className="text-xl text-gray-300">Reduce PDF file size without significant quality loss.</p>
        </motion.div>

        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          {!file ? (
            <div className="text-center">
              <Upload className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Upload a PDF File</h3>
              <input type="file" accept=".pdf" onChange={handleFileChange} id="pdf-upload" className="hidden" />
              <label htmlFor="pdf-upload" className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform inline-flex items-center space-x-2 cursor-pointer">
                <Upload className="h-5 w-5" />
                <span>Select PDF</span>
              </label>
            </div>
          ) : (
            <div>
              <div className="bg-white/5 p-4 rounded-xl mb-6">
                <h3 className="text-white font-medium">{file.name}</h3>
                <p className="text-sm text-gray-400">Original Size: {formatFileSize(originalSize)}</p>
              </div>

              

              <button onClick={compressPdf} disabled={isProcessing} className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform disabled:opacity-50">
                {isProcessing ? <Loader className="h-6 w-6 animate-spin mx-auto" /> : 'Compress PDF'}
              </button>

              {error && <p className="text-red-400 text-center mt-4">{error}</p>}

              {compressedUrl && (
                <div className="mt-6 bg-green-500/10 p-4 rounded-xl text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-white">Compression Complete!</h3>
                  <p className="text-gray-300">New Size: {formatFileSize(compressedSize)}</p>
                  <p className="text-green-400 font-bold">Reduction: {((1 - compressedSize / originalSize) * 100).toFixed(2)}%</p>
                  <a href={compressedUrl} download={`compressed-${file.name}`} className="mt-4 inline-block px-6 py-2 bg-green-600 text-white rounded-lg">Download</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFCompressor;



