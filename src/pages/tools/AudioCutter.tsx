import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Scissors, Download, XCircle, Loader, Play, Pause, Volume2 } from 'lucide-react';

const AudioCutter = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [cutAudioUrl, setCutAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExtension && supportedFormats.includes(fileExtension)) {
        setFile(selectedFile);
        const url = URL.createObjectURL(selectedFile);
        setAudioUrl(url);
        setError(null);
        setCutAudioUrl(null);
      } else {
        setError('Please select a valid audio file (MP3, WAV, OGG, M4A, FLAC, AAC)');
      }
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleAudioLoad = () => {
    if (audioRef.current) {
      const audioDuration = audioRef.current.duration;
      setDuration(audioDuration);
      setEndTime(audioDuration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const cutAudio = async () => {
    if (!file || !audioRef.current) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate sample positions
      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const cutLength = endSample - startSample;

      // Create new buffer for cut audio
      const cutBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        cutLength,
        sampleRate
      );

      // Copy audio data for the selected range
      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const cutData = cutBuffer.getChannelData(channel);
        
        for (let i = 0; i < cutLength; i++) {
          cutData[i] = originalData[startSample + i];
        }
      }

      // Convert to WAV
      const wavBlob = await bufferToWav(cutBuffer);
      const url = URL.createObjectURL(wavBlob);
      setCutAudioUrl(url);

    } catch (err: any) {
      setError(`Failed to cut audio: ${err.message}`);
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
    
    // WAV header
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

  const downloadCutAudio = () => {
    if (cutAudioUrl && file) {
      const link = document.createElement('a');
      link.href = cutAudioUrl;
      link.download = `cut_${file.name.split('.')[0]}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setFile(null);
    setAudioUrl(null);
    setCutAudioUrl(null);
    setError(null);
    setDuration(0);
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
    setIsPlaying(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-4">
            Audio Cutter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Cut and trim your audio files with precision
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center cursor-pointer hover:border-pink-500 dark:hover:border-pink-400 transition-colors"
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
                  <Volume2 className="h-8 w-8 text-pink-500" />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {duration > 0 && `Duration: ${formatTime(duration)}`}
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

              {audioUrl && (
                <>
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onLoadedMetadata={handleAudioLoad}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        onClick={togglePlayPause}
                        className="flex items-center justify-center w-12 h-12 bg-pink-600 hover:bg-pink-700 text-white rounded-full transition-colors"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div
                            className="h-2 bg-pink-500 rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                          />
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={duration}
                          step="0.1"
                          value={currentTime}
                          onChange={(e) => handleSeek(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Time: {formatTime(startTime)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            step="0.1"
                            value={startTime}
                            onChange={(e) => setStartTime(Math.min(parseFloat(e.target.value), endTime - 0.1))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Time: {formatTime(endTime)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max={duration}
                            step="0.1"
                            value={endTime}
                            onChange={(e) => setEndTime(Math.max(parseFloat(e.target.value), startTime + 0.1))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                        </div>
                      </div>

                      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Selected duration: {formatTime(endTime - startTime)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {cutAudioUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Scissors className="h-6 w-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">
                          Audio cut successfully!
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          Ready for download
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={downloadCutAudio}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </motion.div>
              )}

              <button
                onClick={cutAudio}
                disabled={isProcessing || !duration}
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Cutting...
                  </>
                ) : (
                  <>
                    <Scissors className="-ml-1 mr-3 h-5 w-5" />
                    Cut Audio
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

export default AudioCutter;

