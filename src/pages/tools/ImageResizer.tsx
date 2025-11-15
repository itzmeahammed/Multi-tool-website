import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Image as ImageIcon, Loader, XCircle, RefreshCw, Lock, Unlock } from 'lucide-react';

const ImageResizer = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setOriginalFile(file);
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setResizedUrl(null);
      setError(null);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
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
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setResizedUrl(null);
      setError(null);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
        setAspectRatio(img.width / img.height);
      };
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setWidth(newWidth);
    if (keepAspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setHeight(newHeight);
    if (keepAspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  const resizeImage = async () => {
    if (!originalFile || width <= 0 || height <= 0) {
      setError('Please select an image and set valid dimensions.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    const image = new Image();
    image.src = originalUrl!;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsProcessing(false);
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setResizedUrl(URL.createObjectURL(blob));
          } else {
            setError('Resizing failed.');
          }
          setIsProcessing(false);
        },
        originalFile.type,
        1
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
    setResizedUrl(null);
    setError(null);
    setWidth(0);
    setHeight(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Resize images to your desired dimensions with ease.
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
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
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Original Image</h3>
                  <img src={originalUrl!} alt="Original" className="rounded-lg max-h-80 mx-auto" />
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{originalWidth} x {originalHeight} px</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Resized Preview</h3>
                  {isProcessing ? (
                    <div className="h-80 flex items-center justify-center"><Loader className="animate-spin h-12 w-12 text-green-500" /></div>
                  ) : resizedUrl ? (
                    <img src={resizedUrl} alt="Resized" className="rounded-lg max-h-80 mx-auto" />
                  ) : (
                    <div className="h-80 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {resizedUrl && <p className="mt-2 text-gray-600 dark:text-gray-400">{width} x {height} px</p>}
                </div>
              </div>

              <div className="mt-8 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-full">
                    <label htmlFor="width" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Width (px)</label>
                    <input id="width" type="number" value={width} onChange={handleWidthChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                  <button onClick={() => setKeepAspectRatio(!keepAspectRatio)} className="mt-6 p-2 text-gray-500 hover:text-green-500">
                    {keepAspectRatio ? <Lock /> : <Unlock />}
                  </button>
                  <div className="w-full">
                    <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Height (px)</label>
                    <input id="height" type="number" value={height} onChange={handleHeightChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={resizeImage}
                  disabled={isProcessing || !width || !height}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isProcessing ? <Loader className="animate-spin mr-2" /> : <RefreshCw className="mr-2" />} 
                  Resize
                </button>
                {resizedUrl && (
                  <a
                    href={resizedUrl}
                    download={`resized_${originalFile.name}`}
                    className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
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

export default ImageResizer;

