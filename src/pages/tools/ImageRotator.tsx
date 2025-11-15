import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Loader, XCircle, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';

const ImageRotator = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setOriginalFile(file);
      setImageUrl(URL.createObjectURL(file));
      setError(null);
      setRotation(0);
      setScaleX(1);
      setScaleY(1);
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
      setImageUrl(URL.createObjectURL(file));
      setError(null);
      setRotation(0);
      setScaleX(1);
      setScaleY(1);
    }
  };

  const applyTransformation = () => {
    if (!imageUrl) return;

    setIsProcessing(true);
    setError(null);

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Could not get canvas context.');
        setIsProcessing(false);
        return;
      }

      const rad = rotation * Math.PI / 180;
      const absCos = Math.abs(Math.cos(rad));
      const absSin = Math.abs(Math.sin(rad));
      
      canvas.width = image.width * absCos + image.height * absSin;
      canvas.height = image.width * absSin + image.height * absCos;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.scale(scaleX, scaleY);
      ctx.drawImage(image, -image.width / 2, -image.height / 2);

      canvas.toBlob((blob) => {
        if (blob) {
          const newUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = newUrl;
          link.download = `rotated_${originalFile?.name || 'image.png'}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(newUrl);
        } else {
          setError('Failed to create blob.');
        }
        setIsProcessing(false);
      }, originalFile?.type || 'image/png', 1);
    };
    image.onerror = () => {
      setError('Failed to load image.');
      setIsProcessing(false);
    };
  };

  const reset = () => {
    setOriginalFile(null);
    setImageUrl(null);
    setError(null);
    setRotation(0);
    setScaleX(1);
    setScaleY(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-yellow-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            Image Rotator & Flipper
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Easily rotate and flip your images.
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

          {!imageUrl ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-pink-500 dark:hover:border-pink-400 transition-colors"
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
              <div className="flex justify-center mb-6">
                <motion.img
                  src={imageUrl}
                  alt="Preview"
                  className="rounded-lg max-h-96 shadow-lg"
                  animate={{
                    rotate: rotation,
                    scaleX: scaleX,
                    scaleY: scaleY
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <button onClick={() => setRotation(r => r - 90)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><RotateCcw /> Rotate Left</button>
                <button onClick={() => setRotation(r => r + 90)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><RotateCw /> Rotate Right</button>
                <button onClick={() => setScaleX(s => s * -1)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><FlipHorizontal /> Flip Horiz</button>
                <button onClick={() => setScaleY(s => s * -1)} className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"><FlipVertical /> Flip Vert</button>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  onClick={applyTransformation}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-red-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {isProcessing ? <Loader className="animate-spin mr-2" /> : <Download className="mr-2" />} 
                  Apply & Download
                </button>
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

export default ImageRotator;

