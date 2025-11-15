import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Music, Upload, Download, Play, Pause, FileAudio, Loader, CheckCircle } from 'lucide-react';

interface AudioFile {
  id: string;
  file: File;
  name: string;
  size: number;
  duration?: number;
  convertedUrl?: string;
  isConverting: boolean;
  isCompleted: boolean;
}

const AudioConverter = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'mp3' | 'wav' | 'ogg' | 'aac' | 'flac'>('mp3');
  const [quality, setQuality] = useState<'128' | '192' | '256' | '320'>('192');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const formats = [
    { value: 'mp3', label: 'MP3', desc: 'Most compatible' },
    { value: 'wav', label: 'WAV', desc: 'Uncompressed' },
    { value: 'ogg', label: 'OGG', desc: 'Open source' },
    { value: 'aac', label: 'AAC', desc: 'Apple standard' },
    { value: 'flac', label: 'FLAC', desc: 'Lossless' }
  ];

  const qualities = [
    { value: '128', label: '128 kbps', desc: 'Small size' },
    { value: '192', label: '192 kbps', desc: 'Good quality' },
    { value: '256', label: '256 kbps', desc: 'High quality' },
    { value: '320', label: '320 kbps', desc: 'Best quality' }
  ];

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('audio/')
    );
    
    files.forEach(handleAudioUpload);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(handleAudioUpload);
    }
  };

  const handleAudioUpload = (file: File) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const audioFile: AudioFile = {
      id,
      file,
      name: file.name,
      size: file.size,
      isConverting: false,
      isCompleted: false
    };

    // Get audio duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      setAudioFiles(prev => prev.map(af => 
        af.id === id ? { ...af, duration: audio.duration } : af
      ));
    };

    setAudioFiles(prev => [...prev, audioFile]);
  };

  const convertAudio = async (fileId: string) => {
    const audioFile = audioFiles.find(af => af.id === fileId);
    if (!audioFile) return;

    setAudioFiles(prev => prev.map(af => 
      af.id === fileId ? { ...af, isConverting: true } : af
    ));

    try {
      // Create audio context for processing
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const response = await fetch(URL.createObjectURL(audioFile.file));
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Convert to WAV format (most compatible for client-side)
      const convertedBlob = audioBufferToWav(audioBuffer);
      const convertedUrl = URL.createObjectURL(convertedBlob);

      setAudioFiles(prev => prev.map(af => 
        af.id === fileId ? { 
          ...af, 
          isConverting: false, 
          isCompleted: true, 
          convertedUrl 
        } : af
      ));
    } catch (error) {
      console.error('Conversion failed:', error);
      setAudioFiles(prev => prev.map(af => 
        af.id === fileId ? { ...af, isConverting: false } : af
      ));
    }
  };

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length * buffer.numberOfChannels * 2 + 44;
    const arrayBuffer = new ArrayBuffer(length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let offset = 0;
    let pos = 0;

    // Write WAV header
    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };
    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    // RIFF identifier 'RIFF'
    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(buffer.numberOfChannels);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * buffer.numberOfChannels * 2);
    setUint16(buffer.numberOfChannels * 2);
    setUint16(16);
    setUint32(0x61746164);
    setUint32(length - pos - 4);

    // write interleaved data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (let i = 0; i < buffer.numberOfChannels; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  const handleConvertAll = async () => {
    const filesToConvert = audioFiles.filter(af => !af.isCompleted && !af.isConverting);
    for (const file of filesToConvert) {
      await convertAudio(file.id);
    }
  };

  const downloadAudio = (file: AudioFile) => {
    if (file.convertedUrl) {
      const link = document.createElement('a');
      link.href = file.convertedUrl;
      link.download = `${file.name.split('.')[0]}.${outputFormat}`;
      link.click();
    }
  };

  const playPauseAudio = (fileId: string, audioUrl: string) => {
    const audioElement = audioRefs.current[fileId] || new Audio(audioUrl);
    
    if (!audioRefs.current[fileId]) {
      audioRefs.current[fileId] = audioElement;
    }

    if (isPlaying === fileId) {
      audioElement.pause();
      setIsPlaying(null);
    } else {
      Object.values(audioRefs.current).forEach(audio => audio.pause());
      audioElement.play();
      setIsPlaying(fileId);
      audioElement.onended = () => setIsPlaying(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6"
          >
            <Music className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Audio <span className="text-orange-600">Converter</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert audio files between different formats with customizable quality settings
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Audio Files</h2>
            
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-orange-200 hover:border-orange-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <motion.div
                animate={{ y: dragActive ? -10 : 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Music className="h-16 w-16 text-orange-600 mx-auto" />
                <h3 className="text-xl font-bold text-white">
                  Drop audio files here or click to browse
                </h3>
                <p className="text-gray-400">
                  Supports MP3, WAV, OGG, AAC, FLAC, M4A, WMA
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform inline-flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Browse Files</span>
                </button>
              </motion.div>
            </div>

            {audioFiles.length > 0 && (
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Audio Files ({audioFiles.length})</h3>
                  <button
                    onClick={handleConvertAll}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform"
                  >
                    Convert All
                  </button>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {audioFiles.map((audioFile) => (
                    <motion.div
                      key={audioFile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 rounded-2xl p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileAudio className="h-6 w-6 text-orange-600" />
                          <div>
                            <h4 className="text-white font-medium">{audioFile.name}</h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                              <span>{formatFileSize(audioFile.size)}</span>
                              {audioFile.duration && (
                                <>
                                  <span>•</span>
                                  <span>{formatDuration(audioFile.duration)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => playPauseAudio(audioFile.id, URL.createObjectURL(audioFile.file))}
                            className="p-2 bg-gray-50 border border-gray-300 rounded-lg text-orange-600 hover:bg-white/20 transition-colors"
                          >
                            {isPlaying === audioFile.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          
                          {audioFile.isCompleted ? (
                            <button
                              onClick={() => downloadAudio(audioFile)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:scale-105 transition-transform flex items-center space-x-2"
                            >
                              <Download className="h-4 w-4" />
                              <span>Download</span>
                            </button>
                          ) : audioFile.isConverting ? (
                            <div className="px-4 py-2 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-yellow-400 flex items-center space-x-2">
                              <Loader className="h-4 w-4 animate-spin" />
                              <span>Converting...</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => convertAudio(audioFile.id)}
                              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-medium rounded-lg hover:scale-105 transition-transform"
                            >
                              Convert
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {audioFile.isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center space-x-2 text-green-400 text-sm"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Converted to {outputFormat.toUpperCase()}</span>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 h-fit"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversion Settings</h2>
            
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-600 mb-4">Output Format</label>
              <div className="space-y-3">
                {formats.map((format) => (
                  <motion.button
                    key={format.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOutputFormat(format.value as any)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      outputFormat === format.value
                        ? 'border-orange-400 bg-purple-500/20 text-white'
                        : 'border-white/20 bg-white/5 text-gray-600 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{format.label}</div>
                        <div className="text-sm opacity-70">{format.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-600 mb-4">Quality</label>
              <div className="space-y-3">
                {qualities.map((qual) => (
                  <motion.button
                    key={qual.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setQuality(qual.value as any)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      quality === qual.value
                        ? 'border-orange-400 bg-purple-500/20 text-white'
                        : 'border-white/20 bg-white/5 text-gray-600 hover:border-white/30'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{qual.label}</div>
                        <div className="text-sm opacity-70">{qual.desc}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AudioConverter;






