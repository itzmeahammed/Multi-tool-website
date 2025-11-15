import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Download, XCircle, Loader, ArrowUp, ArrowDown, Music } from 'lucide-react';

interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

const AudioMerger = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const supportedFormats = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []);
    addFiles(files);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const addFiles = (files: File[]) => {
    const valid = files.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return !!ext && supportedFormats.includes(ext);
    });
    const mapped: AudioFile[] = valid.map((f) => ({
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      name: f.name,
      size: f.size,
    }));
    setAudioFiles(prev => [...prev, ...mapped]);
    setError(valid.length ? null : 'Please add valid audio files');
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    setAudioFiles(prev => {
      const copy = [...prev];
      const [removed] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, removed);
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setAudioFiles(prev => prev.filter(f => f.id !== id));
    setMergedUrl(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const mergeAudio = async () => {
    if (audioFiles.length < 2) return;
    setIsProcessing(true);
    setError(null);
    setMergedUrl(null);

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Decode all files
      const decodedBuffers: AudioBuffer[] = [];
      for (const item of audioFiles) {
        const arrayBuffer = await item.file.arrayBuffer();
        const decoded = await audioContext.decodeAudioData(arrayBuffer);
        decodedBuffers.push(decoded);
      }

      // Determine output properties
      const sampleRate = decodedBuffers[0].sampleRate;
      const channels = Math.max(...decodedBuffers.map(b => b.numberOfChannels));
      const totalLength = decodedBuffers.reduce((sum, b) => sum + b.length, 0);

      const output = audioContext.createBuffer(channels, totalLength, sampleRate);

      // Concatenate sequentially
      let offset = 0;
      for (const buffer of decodedBuffers) {
        for (let ch = 0; ch < channels; ch++) {
          const out = output.getChannelData(ch);
          const src = buffer.getChannelData(Math.min(ch, buffer.numberOfChannels - 1));
          out.set(src, offset);
        }
        offset += buffer.length;
      }

      const wavBlob = await bufferToWav(output);
      setMergedUrl(URL.createObjectURL(wavBlob));
    } catch (e: any) {
      setError(`Failed to merge audio: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const bufferToWav = async (buffer: AudioBuffer): Promise<Blob> => {
    const channels = buffer.numberOfChannels;
    const length = buffer.length;
    const sampleRate = buffer.sampleRate;

    const arrayBuffer = new ArrayBuffer(44 + length * 2 * channels);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, s: string) => {
      for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2 * channels, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2 * channels, true);
    view.setUint16(32, 2 * channels, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2 * channels, true);

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let ch = 0; ch < channels; ch++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const downloadMerged = () => {
    if (mergedUrl) {
      const link = document.createElement('a');
      link.href = mergedUrl;
      link.download = 'merged_audio.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const reset = () => {
    setAudioFiles([]);
    setMergedUrl(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 white p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
            Audio Merger
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Combine multiple audio files into one seamless track
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
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

          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 dark:hover:border-teal-400 transition-colors"
            onClick={triggerFileSelect}
          >
            <Upload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload Audio Files
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Click to browse or drag and drop multiple audio files here
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
              multiple
            />
          </div>

          {audioFiles.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Files ({audioFiles.length})</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={mergeAudio}
                    disabled={audioFiles.length < 2 || isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isProcessing ? (
                      <>
                        <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        <span>Merging...</span>
                      </>
                    ) : (
                      <>
                        <Play className="-ml-1 mr-2 h-5 w-5" />
                        <span>Merge Audio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {audioFiles.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Music className="h-6 w-6 text-teal-500" />
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(item.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveItem(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        className="p-2 text-gray-500 hover:text-teal-500 disabled:opacity-50"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, Math.min(audioFiles.length - 1, index + 1))}
                        disabled={index === audioFiles.length - 1}
                        className="p-2 text-gray-500 hover:text-teal-500 disabled:opacity-50"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {mergedUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      Audio merged successfully!
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Ready for download
                    </p>
                  </div>
                </div>
                <button
                  onClick={downloadMerged}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AudioMerger;

