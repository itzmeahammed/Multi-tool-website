import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Volume2, Download, XCircle, Loader, Sliders } from 'lucide-react';

const VolumeBooster = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [boostedUrl, setBoostedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [boostLevel, setBoostLevel] = useState<number>(150);
  const [normalize, setNormalize] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension && supportedFormats.includes(fileExtension)) {
        setFile(selectedFile);
        setError(null);
        setBoostedUrl(null);
      } else {
        setError('Please select a valid audio file (MP3, WAV, OGG, M4A, FLAC, AAC)');
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const boostVolume = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Create new buffer for boosted audio
      const boostedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      const gainFactor = boostLevel / 100;

      // Process each channel
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const boostedData = boostedBuffer.getChannelData(channel);
        
        let maxAmplitude = 0;
        
        // Find peak amplitude if normalizing
        if (normalize) {
          for (let i = 0; i < originalData.length; i++) {
            maxAmplitude = Math.max(maxAmplitude, Math.abs(originalData[i]));
          }
        }
        
        // Apply boost with optional normalization
        for (let i = 0; i < originalData.length; i++) {
          let sample = originalData[i] * gainFactor;
          
          if (normalize && maxAmplitude > 0) {
            // Normalize to prevent clipping
            const normalizedGain = Math.min(gainFactor, 0.95 / maxAmplitude);
            sample = originalData[i] * normalizedGain;
          }
          
          // Clamp to prevent distortion
          boostedData[i] = Math.max(-1, Math.min(1, sample));
        }
      }

      // Convert to WAV
      const wavBlob = await bufferToWav(boostedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setBoostedUrl(url);

    } catch (err: any) {
      setError(`Failed to boost volume: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const bufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2 * buffer.numberOfChannels);
    const view = new DataView(arrayBuffer);
    
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2 * buffer.numberOfChannels, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2 * buffer.numberOfChannels, true);
    view.setUint16(32, 2 * buffer.numberOfChannels, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2 * buffer.numberOfChannels, true);
    
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const downloadBoosted = () => {
    if (boostedUrl && file) {
      const link = document.createElement('a');
      link.href = boostedUrl;
      link.download = `boosted_${file.name.split('.')[0]}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setFile(null);
    setBoostedUrl(null);
    setError(null);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br white white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Volume Booster
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Safely boost audio volume with smart normalization
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
              onClick={triggerFileSelect}
            >
              <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Upload Audio File
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Click to browse or drag and drop your audio file here
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Supported formats: MP3, WAV, OGG, M4A, FLAC, AAC
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="audio/*"
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
                  <Volume2 className="h-8 w-8 text-indigo-500" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
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

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      <Sliders className="inline h-4 w-4 mr-2" />
                      Volume Boost Level
                    </label>
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {boostLevel}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="300"
                    step="10"
                    value={boostLevel}
                    onChange={(e) => setBoostLevel(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>50%</span>
                    <span>100% (Original)</span>
                    <span>300%</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="normalize"
                    checked={normalize}
                    onChange={(e) => setNormalize(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="normalize" className="text-sm text-gray-700 dark:text-gray-300">
                    Smart normalization (prevents clipping and distortion)
                  </label>
                </div>
              </div>

              {boostedUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Volume2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          Volume boosted successfully!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Ready for download
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={downloadBoosted}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              )}

              <button
                onClick={boostVolume}
                disabled={isProcessing}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Boosting...
                  </>
                ) : (
                  <>
                    <Volume2 className="-ml-1 mr-3 h-5 w-5" />
                    Boost Volume
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

export default VolumeBooster;


