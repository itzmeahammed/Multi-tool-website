import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  MessageSquare, 
  Languages, 
  FileText,
  Sparkles,
  Bot,
  Zap,
  Globe,
  Upload,
  ArrowRight,
  Cpu,
  Lightbulb,
  Search
} from 'lucide-react';

const AITools = () => {
  const [dragActive, setDragActive] = useState(false);

  const tools = [
    {
      title: "AI Chat Assistant",
      description: "Intelligent conversational AI for any task",
      icon: MessageSquare,
      href: "/tools/ai-chat",
      color: "from-blue-500 to-cyan-500",
      features: ["Natural Language", "Context Aware", "Multi-turn Chat", "Smart Suggestions"],
      popular: true
    },
    {
      title: "Text Summarizer",
      description: "Extract key points from any text",
      icon: FileText,
      href: "/tools/text-summarizer",
      color: "from-green-500 to-teal-500",
      features: ["AI-Powered", "Custom Length", "Key Points", "Multiple Languages"]
    },
    {
      title: "Language Translator",
      description: "Translate text between 100+ languages",
      icon: Languages,
      href: "/tools/translator",
      color: "from-purple-500 to-pink-500",
      features: ["100+ Languages", "Real-time", "Context Aware", "Bulk Translate"]
    },
    {
      title: "Content Generator",
      description: "Generate creative content with AI",
      icon: Lightbulb,
      href: "/tools/content-generator",
      color: "from-orange-500 to-red-500",
      features: ["Blog Posts", "Social Media", "Emails", "Creative Writing"]
    },
    {
      title: "Grammar Checker",
      description: "Advanced grammar and style checking",
      icon: Search,
      href: "/tools/grammar-checker",
      color: "from-indigo-500 to-blue-500",
      features: ["Grammar Fix", "Style Suggestions", "Tone Analysis", "Multiple Languages"]
    },
    {
      title: "AI Paraphraser",
      description: "Rewrite text while preserving meaning",
      icon: Bot,
      href: "/tools/paraphraser",
      color: "from-pink-500 to-red-500",
      features: ["Multiple Modes", "Plagiarism Free", "Tone Control", "Bulk Process"]
    },
    {
      title: "Keyword Extractor",
      description: "Extract important keywords from text",
      icon: Cpu,
      href: "/tools/keyword-extractor",
      color: "from-teal-500 to-green-500",
      features: ["SEO Keywords", "Relevance Score", "Bulk Analysis", "Export Options"]
    },
    {
      title: "Text Analytics",
      description: "Analyze sentiment and emotions",
      icon: Brain,
      href: "/tools/text-analytics",
      color: "from-violet-500 to-purple-500",
      features: ["Sentiment Analysis", "Emotion Detection", "Entity Recognition", "Data Insights"]
    }
  ];

  const aiFeatures = [
    {
      icon: Brain,
      title: "Advanced AI Models",
      description: "Powered by state-of-the-art language models"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Work with 100+ languages seamlessly"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get results in seconds, not minutes"
    },
    {
      icon: Sparkles,
      title: "High Accuracy",
      description: "Industry-leading precision and quality"
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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6"
          >
            <Brain className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI <span className="text-orange-600">Tools</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Harness the power of artificial intelligence for content creation, analysis, and automation
          </p>
        </motion.div>

        {/* AI Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-2xl p-6 text-center border-2 border-orange-100"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-4"
              >
                <feature.icon className="h-6 w-6 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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
                  <Brain className="h-16 w-16 text-orange-500 mx-auto" />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sparkles className="h-8 w-8 text-orange-400 opacity-60" />
                  </motion.div>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Quick AI Processing
              </h3>
              <p className="text-gray-600 mb-6">
                Upload text files or paste content directly for AI analysis
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-2xl flex items-center space-x-2 mx-auto shadow-lg shadow-orange-500/25"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload Text File</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-orange-500 text-orange-600 font-semibold rounded-2xl hover:bg-orange-50 transition-colors"
                >
                  Paste Text
                </motion.button>
              </div>
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
                  className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center space-x-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Popular</span>
                </motion.div>
              )}
              
              <Link to={tool.href}>
                <div className="bg-white rounded-2xl p-6 h-full border-2 border-orange-100 hover:border-orange-300 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-orange-500/20 relative overflow-hidden">
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${tool.color} rounded-xl mb-4 relative z-10`}
                  >
                    <tool.icon className="h-7 w-7 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors relative z-10">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors relative z-10">
                    {tool.description}
                  </p>
                  
                  <div className="space-y-1 mb-4 relative z-10">
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
                    className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors text-sm font-medium relative z-10"
                    whileHover={{ x: 5 }}
                  >
                    <span>Try AI Tool</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* AI Showcase Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center border-2 border-orange-100 relative overflow-hidden">
            {/* Animated neural network background */}
            <div className="absolute inset-0 opacity-5">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-orange-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 relative z-10"
            >
              <Sparkles className="h-10 w-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative z-10">
              Next-Generation AI Technology
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Experience the future of text processing with our advanced AI models. 
              From natural language understanding to creative content generation, unlock limitless possibilities.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                { title: "GPT-Powered", desc: "Latest language models" },
                { title: "Real-time", desc: "Instant processing" },
                { title: "Privacy First", desc: "Secure & confidential" }
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

export default AITools;