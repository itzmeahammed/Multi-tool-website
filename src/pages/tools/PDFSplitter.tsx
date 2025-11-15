import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Upload, FileText, Loader } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

interface PDFFile {
  file: File;
  name: string;
  pageCount: number;
}

const PDFSplitter = () => {
  const [pdfFile, setPdfFile] = useState<PDFFile | null>(null);
  const [splitMode, setSplitMode] = useState<'range' | 'single'>('range');
  const [range, setRange] = useState({ from: '', to: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setPdfFile({
          file,
          name: file.name,
          pageCount: pdfDoc.getPageCount(),
        });
        setError(null);
        setRange({ from: '', to: '' });
      } catch (err) {
        setError('Failed to load PDF. The file might be corrupt or protected.');
        setPdfFile(null);
      }
    }
  };

  const handleSplit = async () => {
    if (!pdfFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const originalPdfBytes = await pdfFile.file.arrayBuffer();
      const originalPdf = await PDFDocument.load(originalPdfBytes);

      if (splitMode === 'range') {
        const from = parseInt(range.from, 10);
        const to = parseInt(range.to, 10);

        if (isNaN(from) || isNaN(to) || from < 1 || to > pdfFile.pageCount || from > to) {
          setError('Invalid page range.');
          setIsProcessing(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const indices = Array.from({ length: to - from + 1 }, (_, i) => from + i - 1);
        const copiedPages = await newPdf.copyPages(originalPdf, indices);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        downloadFile(pdfBytes, `split_${pdfFile.name}`);
      } else if (splitMode === 'single') {
        const zip = new JSZip();
        for (let i = 0; i < pdfFile.pageCount; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(originalPdf, [i]);
          newPdf.addPage(copiedPage);
          const pdfBytes = await newPdf.save();
          zip.file(`${pdfFile.name.replace('.pdf', '')}_page_${i + 1}.pdf`, pdfBytes);
        }
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadFile(zipBlob, `${pdfFile.name.replace('.pdf', '')}_split.zip`);
      }
    } catch (err) {
      setError('An error occurred while splitting the PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (data: BlobPart, filename: string) => {
    const blob = new Blob([data], { type: data instanceof Uint8Array ? 'application/pdf' : 'application/zip' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl mb-6">
            <Scissors className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">PDF Splitter</h1>
          <p className="text-xl text-gray-300">Extract pages or split a PDF into multiple documents.</p>
        </motion.div>

        <div className="bg-white rounded-3xl p-8 border-2 border-orange-100">
          {!pdfFile ? (
            <div className="text-center">
              <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Upload a PDF File</h3>
              <p className="text-gray-400 mb-6">Select a PDF to begin splitting.</p>
              <input type="file" accept=".pdf" onChange={handleFileSelect} id="pdf-upload" className="hidden" />
              <label htmlFor="pdf-upload" className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform inline-flex items-center space-x-2 cursor-pointer">
                <Upload className="h-5 w-5" />
                <span>Browse PDF</span>
              </label>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl mb-6">
                <div>
                  <h3 className="text-white font-medium">{pdfFile.name}</h3>
                  <p className="text-sm text-gray-400">{pdfFile.pageCount} pages</p>
                </div>
                <button onClick={() => setPdfFile(null)} className="text-gray-400 hover:text-white">Change File</button>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-4">Split Mode</h3>
                <div className="flex gap-4">
                  <button onClick={() => setSplitMode('range')} className={`flex-1 p-4 rounded-xl border ${splitMode === 'range' ? 'border-red-400 bg-red-500/10' : 'border-white/10'}`}>Extract Pages</button>
                  <button onClick={() => setSplitMode('single')} className={`flex-1 p-4 rounded-xl border ${splitMode === 'single' ? 'border-red-400 bg-red-500/10' : 'border-white/10'}`}>Split to Single Pages</button>
                </div>
              </div>

              {splitMode === 'range' && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">Select Page Range</h3>
                  <div className="flex items-center gap-4">
                    <input type="number" placeholder="From" value={range.from} onChange={e => setRange({...range, from: e.target.value})} min="1" max={pdfFile.pageCount} className="w-full bg-white/5 p-3 rounded-lg text-white" />
                    <input type="number" placeholder="To" value={range.to} onChange={e => setRange({...range, to: e.target.value})} min="1" max={pdfFile.pageCount} className="w-full bg-white/5 p-3 rounded-lg text-white" />
                  </div>
                </div>
              )}

              {error && <p className="text-red-400 text-center mb-4">{error}</p>}

              <button onClick={handleSplit} disabled={isProcessing} className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform disabled:opacity-50">
                {isProcessing ? <Loader className="h-6 w-6 animate-spin mx-auto" /> : 'Split PDF'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFSplitter;


