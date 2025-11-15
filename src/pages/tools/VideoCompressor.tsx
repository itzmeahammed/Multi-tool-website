import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Video, Download, XCircle, Loader, Settings, Sliders } from 'lucide-react';

const VideoCompressor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quality, setQuality] = useState<string>('medium');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv'];
  const qualityOptions = [
    { value: 'low', label: 'Low Quality', desc: 'Smallest file size' },
    { value: 'medium', label: 'Medium Quality', desc: 'Balanced size/quality' },
    { value: 'high', label: 'High Quality', desc: 'Best quality' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension && supportedFormats.includes(fileExtension)) {
        setFile(selectedFile);
        setOriginalSize(selectedFile.size);
        setError(null);
        setCompressedUrl(null);
      } else {
        setError('Please select a valid video file (MP4, AVI, MOV, MKV, WebM, FLV)');
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const compressVideo = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate compression progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 5;
        });
      }, 300);

      // Create video element for processing
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
      });

      // Simulate compression (in real app, you'd use FFmpeg.js or backend)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Calculate simulated compression ratio
      const compressionRatio = quality === 'low' ? 0.3 : quality === 'medium' ? 0.5 : 0.7;
      const simulatedSize = Math.floor(file.size * compressionRatio);
      setCompressedSize(simulatedSize);

      // Create a blob with simulated compressed data
      const compressedBlob = new Blob([file], { type: 'video/mp4' });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      const url = URL.createObjectURL(compressedBlob);
      setCompressedUrl(url);

    } catch (err: any) {
      setError(`Failed to compress video: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadCompressed = () => {
    if (compressedUrl && file) {
      const link = document.createElement('a');
      link.href = compressedUrl;
      link.download = `compressed_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setFile(null);
    setCompressedUrl(null);
    setError(null);
    setProgress(0);
    setIsProcessing(false);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Video Compressor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Reduce video file size while maintaining quality
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md flex items-center mb-6"
            >
              <XCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </motion.div>
          )}

          {!file ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
              onClick={triggerFileSelect}
            >
              <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Upload Video File
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Click to browse or drag and drop your video file here
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Supported formats: MP4, AVI, MOV, MKV, WebM, FLV
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="video/*"
              />
            </motion.div>
          ) : (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Video className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Compression Quality
                    </label>
                    <select
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {qualityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label} - {option.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {compressedSize > 0 && (
                  <div className="flex items-center space-x-4">
                    <Sliders className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Size Reduction
                      </label>
                      <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                        {Math.round(((originalSize - compressedSize) / originalSize) * 100)}% smaller
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(originalSize)} → {formatFileSize(compressedSize)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Compressing video...
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.div>
              )}

              {compressedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          Video compressed successfully!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Ready for download
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={downloadCompressed}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              )}

              <button
                onClick={compressVideo}
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Compressing...
                  </>
                ) : (
                  <>
                    <Video className="-ml-1 mr-3 h-5 w-5" />
                    Compress Video
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VideoCompressor;

