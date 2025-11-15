import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Loader, XCircle, ArrowRight } from 'lucide-react';

const ImageConverter = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setConvertedUrl(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));
      setConvertedUrl(null);
      setError(null);
    }
  };

  const convertImage = () => {
    if (!originalFile) return;

    setIsProcessing(true);
    setError(null);

    const image = new Image();
    image.src = originalUrl!;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(image, 0, 0);

      const mimeType = `image/${outputFormat}`;
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedUrl(URL.createObjectURL(blob));
          } else {
            setError('Conversion failed. The output format may not be supported by your browser.');
          }
          setIsProcessing(false);
        },
        mimeType,
        0.95 // Quality for JPEG/WebP
      );
    };
    image.onerror = () => {
      setError('Failed to load image.');
      setIsProcessing(false);
    };
  };

  const reset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setConvertedUrl(null);
    setError(null);
  };

  const getFileExtension = (format: string) => {
    if (format === 'jpeg') return 'jpg';
    return format;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Image Format Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Convert images between popular formats like PNG, JPEG, and WebP.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {error && (
            <motion.div className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center mb-6">
              <XCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </motion.div>
          )}

          {!originalFile ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload an Image</p>
              <p className="text-gray-500 dark:text-gray-400">Click to browse or drag and drop</p>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Original</h3>
                  <img src={originalUrl!} alt="Original" className="rounded-lg max-h-80 mx-auto" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Converted</h3>
                  {isProcessing ? (
                    <div className="h-80 flex items-center justify-center"><Loader className="animate-spin h-12 w-12 text-orange-600" /></div>
                  ) : convertedUrl ? (
                    <img src={convertedUrl} alt="Converted" className="rounded-lg max-h-80 mx-auto" />
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 max-w-lg mx-auto">
                <div className="flex items-end justify-center gap-4">
                  <div className="w-full">
                    <label htmlFor="format" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Convert to:</label>
                    <select
                      id="format"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="png">PNG</option>
                      <option value="jpeg">JPEG</option>
                      <option value="webp">WebP</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                  <button
                    onClick={convertImage}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-orange-700 hover:to-indigo-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isProcessing ? <Loader className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />} 
                    Convert
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {convertedUrl && (
                  <a
                    href={convertedUrl}
                    download={`converted_${originalFile.name.split('.').slice(0, -1).join('.')}.${getFileExtension(outputFormat)}`}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Download className="mr-2" /> Download
                  </a>
                )}
                <button onClick={reset} className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  Reset
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ImageConverter;


