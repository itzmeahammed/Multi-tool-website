import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, RotateCcw, FileDown, Loader } from 'lucide-react';
import { PDFDocument, RotationTypes } from 'pdf-lib';

const DocumentRotator = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setRotatedUrl(null);
      setError(null);
    } else {
      setError('Please select a valid PDF file.');
    }
  };

    const rotatePdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        const newRotation = (currentRotation + rotation) % 360;
        page.setRotation({ angle: newRotation, type: RotationTypes.Degrees });
      });

      const rotatedPdfBytes = await pdfDoc.save();
      const blob = new Blob([rotatedPdfBytes], { type: 'application/pdf' });
      setRotatedUrl(URL.createObjectURL(blob));

    } catch (e) {
      setError('Failed to rotate PDF. The file may be corrupt.');
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6">
            <RotateCcw className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Document <span className="gradient-text-orange">Rotator</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Rotate all pages in your PDF document with ease.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          {!file ? (
            <div className="text-center">
              <Upload className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Upload a PDF File</h3>
              <p className="text-gray-400 mb-6">Select a PDF to begin rotation.</p>
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept=".pdf" />
              <label htmlFor="file-upload" className="px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform cursor-pointer">
                Browse File
              </label>
            </div>
          ) : (
            <div>
              <div className="text-center mb-6">
                <p className="text-white font-semibold">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024).toFixed(2)} KB</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4 text-center">Rotation Angle</h3>
                <div className="flex justify-center gap-4">
                  {[90, 180, 270].map(angle => (
                    <button key={angle} onClick={() => setRotation(angle)} className={`px-6 py-3 font-semibold rounded-xl transition-all ${rotation === angle ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-600 hover:bg-white/20'}`}>
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={rotatePdf} disabled={isProcessing} className="w-full px-8 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 flex items-center justify-center">
                {isProcessing ? <Loader className="h-6 w-6 animate-spin" /> : <><RotateCcw className="h-6 w-6 mr-2" /><span>Rotate PDF</span></>}
              </button>
            </div>
          )}

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}

          {rotatedUrl && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Rotation Complete!</h3>
              <a href={rotatedUrl} download={`rotated-${file?.name || 'document.pdf'}`} className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform">
                <FileDown className="h-6 w-6 mr-2" />
                Download Rotated PDF
              </a>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentRotator;


