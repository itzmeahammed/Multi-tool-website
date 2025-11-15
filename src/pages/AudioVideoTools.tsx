import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Music, 
  Video, 
  Headphones, 
  Mic, 
  FileAudio,
  Volume2,
  Play,
  Scissors,
  Download,
  Upload,
  ArrowRight,
  BarChart3
} from 'lucide-react';

const AudioVideoTools = () => {
  const [dragActive, setDragActive] = useState(false);

  const tools = [
    {
      title: "Video to MP3",
      description: "Extract audio from video files",
      icon: FileAudio,
      href: "/tools/video-to-mp3",
      color: "from-red-500 to-pink-500",
      features: ["HD Audio", "Multiple Formats", "Batch Convert", "Fast Processing"],
      popular: true
    },
    {
      title: "Audio Converter",
      description: "Convert between audio formats",
      icon: Headphones,
      href: "/tools/audio-converter",
      color: "from-blue-500 to-cyan-500",
      features: ["MP3, WAV, AAC", "Quality Control", "Metadata Preserve", "Batch Process"]
    },
    {
      title: "Video Compressor",
      description: "Reduce video file size",
      icon: Video,
      href: "/tools/video-compressor",
      color: "from-green-500 to-teal-500",
      features: ["Smart Compression", "Quality Presets", "Custom Settings", "Preview Mode"]
    },
    {
      title: "Audio Transcription",
      description: "Convert speech to text",
      icon: Mic,
      href: "/tools/audio-transcription",
      color: "from-purple-500 to-indigo-500",
      features: ["AI-Powered", "Multiple Languages", "High Accuracy", "Export Options"]
    },
    {
      title: "Text to Speech",
      description: "Convert text to natural speech",
      icon: Volume2,
      href: "/tools/text-to-speech",
      color: "from-yellow-500 to-orange-500",
      features: ["Natural Voices", "Multiple Languages", "Speed Control", "Export Audio"]
    },
    {
      title: "Audio Cutter",
      description: "Cut and trim audio files",
      icon: Scissors,
      href: "/tools/audio-cutter",
      color: "from-pink-500 to-red-500",
      features: ["Precise Cutting", "Fade Effects", "Loop Creation", "Multiple Formats"]
    },
    {
      title: "Volume Booster",
      description: "Boost audio volume safely",
      icon: Music,
      href: "/tools/volume-booster",
      color: "from-indigo-500 to-purple-500",
      features: ["Safe Boosting", "Normalize Audio", "Batch Processing", "Quality Preserve"]
    },
    {
      title: "Audio Merger",
      description: "Combine multiple audio files",
      icon: Play,
      href: "/tools/audio-merger",
      color: "from-teal-500 to-green-500",
      features: ["Seamless Merge", "Crossfade", "Custom Order", "Format Options"]
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Audio & Video <span className="text-orange-600">Tools</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional multimedia processing tools for audio extraction, conversion, and enhancement
          </p>
        </motion.div>

        {/* Quick Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <div
            className={`bg-white rounded-3xl p-8 border-2 border-dashed transition-all duration-300 ${
              dragActive 
                ? 'border-orange-400 bg-orange-50' 
                : 'border-orange-200 hover:border-orange-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <motion.div
                animate={{ 
                  y: dragActive ? -10 : 0,
                  scale: dragActive ? 1.1 : 1
                }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <div className="relative">
                  <Video className="h-16 w-16 text-orange-500 mx-auto" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <BarChart3 className="h-8 w-8 text-orange-400 opacity-60" />
                  </motion.div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick Media Upload
              </h3>
              <p className="text-gray-600 mb-6">
                Support for MP4, AVI, MP3, WAV, and many more formats
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl flex items-center space-x-2 mx-auto shadow-lg shadow-orange-500/25"
              >
                <Upload className="h-5 w-5" />
                <span>Select Media Files</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {tool.popular && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10"
                >
                  Popular
                </motion.div>
              )}
              
              <Link to={tool.href}>
                <div className="bg-white rounded-2xl p-6 h-full border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl mb-4`}
                  >
                    <tool.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-1 mb-4">
                    {tool.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.02 }}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors text-sm font-medium"
                    whileHover={{ x: 5 }}
                  >
                    <span>Use Tool</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Audio Visualizer Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-orange-100 relative overflow-hidden">
            {/* Animated background bars */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [20, Math.random() * 100 + 20, 20],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                  className="w-3 bg-gradient-to-t from-orange-500 to-orange-600 mx-1 rounded-full"
                />
              ))}
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 relative z-10"
            >
              <Music className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">
              Professional Audio Processing
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Experience high-fidelity audio and video processing with our advanced algorithms. 
              From format conversion to quality enhancement, get studio-quality results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {[
                { title: "HD Quality", desc: "Lossless processing" },
                { title: "Fast Speed", desc: "Optimized algorithms" },
                { title: "All Formats", desc: "Universal support" },
                { title: "Batch Mode", desc: "Process multiple files" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <h3 className="text-gray-900 font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default AudioVideoTools;