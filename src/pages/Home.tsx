import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Image, 
  Music, 
  Brain, 
  Settings, 
  Zap,
  ArrowRight,
  Star,
  Users,
  Download,
  Clock
} from 'lucide-react';

const Home = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const toolCategories = [
    {
      title: "Document Tools",
      description: "Convert, merge, split, and compress documents with ease",
      icon: FileText,
      href: "/document-tools",
      color: "from-blue-500 to-cyan-500",
      tools: ["PDF Converter", "Word to PDF", "Excel Tools", "PowerPoint Converter"]
    },
    {
      title: "Image Tools",
      description: "Edit, compress, resize, and enhance your images",
      icon: Image,
      href: "/image-tools",
      color: "from-green-500 to-teal-500",
      tools: ["Background Remover", "Image Compressor", "Format Converter", "Resize Tool"]
    },
    {
      title: "Audio & Video",
      description: "Process multimedia files with professional quality",
      icon: Music,
      href: "/audio-video-tools",
      color: "from-purple-500 to-pink-500",
      tools: ["Video to MP3", "Audio Converter", "Video Compressor", "Transcription"]
    },
    {
      title: "AI Tools",
      description: "Harness the power of artificial intelligence",
      icon: Brain,
      href: "/ai-tools",
      color: "from-orange-500 to-red-500",
      tools: ["Text Summarizer", "Language Translator", "Content Generator", "Chat Assistant"]
    },
    {
      title: "Utility Tools",
      description: "Everyday tools for enhanced productivity",
      icon: Settings,
      href: "/utility-tools",
      color: "from-indigo-500 to-purple-500",
      tools: ["QR Generator", "Password Generator", "Unit Converter", "Color Picker"]
    }
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Active Users" },
    { icon: Download, value: "100K+", label: "Files Processed" },
    { icon: Star, value: "4.9", label: "User Rating" },
    { icon: Clock, value: "24/7", label: "Available" }
  ];

  return (
    <div ref={ref} className="relative overflow-hidden bg-white">
      {/* Hero Section */}
      <motion.section 
        style={{ y, opacity }}
        className="min-h-screen flex items-center justify-center relative pt-16 bg-gradient-to-br from-white via-orange-50 to-white"
      >
        {/* 3D Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-200/20 to-orange-100/20 rounded-full mix-blend-multiply filter blur-xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-100/20 to-orange-50/20 rounded-full mix-blend-multiply filter blur-xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full"
                />
                <Zap className="absolute inset-0 m-auto h-10 w-10 text-orange-500 animate-pulse" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="text-orange-600">ToolVault</span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            >
              Your ultimate productivity companion with 25+ powerful tools for document processing, 
              image editing, AI assistance, and much more.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl flex items-center space-x-2 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-2xl hover:bg-orange-50 transition-colors"
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4"
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="text-3xl font-bold text-gray-900 mb-2"
                >
                  {stat.value}
                </motion.div>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tool Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful <span className="text-orange-600">Tool Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our comprehensive suite of productivity tools, each designed to simplify your workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toolCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Link to={category.href}>
                  <div className="bg-white rounded-3xl p-8 h-full border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6`}
                    >
                      <category.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 group-hover:text-gray-700 transition-colors">
                      {category.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      {category.tools.map((tool, toolIndex) => (
                        <motion.div
                          key={tool}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + toolIndex * 0.05 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{tool}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div
                      className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-medium">Explore Tools</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="text-orange-600">ToolVault</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Fast & Secure",
                description: "All processing happens locally in your browser. Your files never leave your device.",
                icon: "🔒"
              },
              {
                title: "No Installation Required",
                description: "Use all tools directly in your browser. No downloads, no setup, no hassle.",
                icon: "🌐"
              },
              {
                title: "Always Free",
                description: "All basic tools are completely free to use. No hidden fees or subscriptions.",
                icon: "💝"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-3xl p-8 text-center border-2 border-orange-100"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;