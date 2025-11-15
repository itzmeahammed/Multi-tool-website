import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  RotateCcw, 
  Crop, 
  Palette, 
  Sliders, 
  Filter,
  Maximize,
  Scissors,
  Undo,
  Redo
} from 'lucide-react';

interface ImageAdjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  rotation: number;
}

const ImageEditor = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'adjust' | 'filter' | 'crop' | 'resize'>('adjust');
  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0,
    rotation: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { name: 'Original', filter: 'none' },
    { name: 'Grayscale', filter: 'grayscale(100%)' },
    { name: 'Sepia', filter: 'sepia(100%)' },
    { name: 'Vintage', filter: 'sepia(50%) contrast(120%) brightness(90%)' },
    { name: 'Cold', filter: 'hue-rotate(180deg) saturate(120%)' },
    { name: 'Warm', filter: 'hue-rotate(30deg) saturate(110%) brightness(105%)' },
    { name: 'High Contrast', filter: 'contrast(150%) saturate(120%)' },
    { name: 'Soft', filter: 'contrast(85%) brightness(110%) saturate(90%)' }
  ];

  const [selectedFilter, setSelectedFilter] = useState('none');

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
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setSelectedImage(imageUrl);
      setOriginalImage(imageUrl);
      // Reset adjustments when new image is loaded
      setAdjustments({
        brightness: 100,
        contrast: 100,
        saturation: 100,
        hue: 0,
        blur: 0,
        rotation: 0
      });
      setSelectedFilter('none');
    };
    reader.readAsDataURL(file);
  };

  const applyAdjustments = () => {
    const { brightness, contrast, saturation, hue, blur, rotation } = adjustments;
    return {
      filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) blur(${blur}px) ${selectedFilter}`,
      transform: `rotate(${rotation}deg)`
    };
  };

  const resetAdjustments = () => {
    setAdjustments({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0,
      rotation: 0
    });
    setSelectedFilter('none');
  };

  const downloadImage = () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    if (ctx) {
      // Apply filters and transformations
      ctx.filter = applyAdjustments().filter;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((adjustments.rotation * Math.PI) / 180);
      ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      ctx.restore();
      
      // Download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `edited-image-${Date.now()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    }
  };

  const tabs = [
    { id: 'adjust', label: 'Adjust', icon: Sliders },
    { id: 'filter', label: 'Filters', icon: Filter },
    { id: 'crop', label: 'Crop', icon: Crop },
    { id: 'resize', label: 'Resize', icon: Maximize }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'adjust':
        return (
          <div className="space-y-6">
            {Object.entries(adjustments).map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-600 capitalize">{key}</label>
                  <span className="text-sm text-orange-600">
                    {key === 'rotation' || key === 'hue' ? `${value}°` : 
                     key === 'blur' ? `${value}px` : `${value}%`}
                  </span>
                </div>
                <input
                  type="range"
                  min={key === 'hue' ? -180 : key === 'rotation' ? -180 : key === 'blur' ? 0 : 0}
                  max={key === 'hue' ? 180 : key === 'rotation' ? 180 : key === 'blur' ? 20 : 200}
                  value={value}
                  onChange={(e) => setAdjustments(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            ))}
            
            <button
              onClick={resetAdjustments}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-medium rounded-xl hover:scale-105 transition-transform"
            >
              Reset All
            </button>
          </div>
        );
      
      case 'filter':
        return (
          <div className="grid grid-cols-2 gap-3">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.filter)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                  selectedFilter === filter.filter
                    ? 'bg-gradient-to-r from-orange-600 to-orange-600 border-orange-500 text-white'
                    : 'bg-white/5 border-white/20 text-gray-600 hover:border-white/30'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        );
      
      case 'crop':
        return (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Crop functionality coming soon...</p>
            <div className="grid grid-cols-2 gap-3">
              {['1:1', '4:3', '16:9', '3:2'].map((ratio) => (
                <button
                  key={ratio}
                  className="p-3 bg-white/5 border border-white/20 rounded-xl text-gray-600 hover:border-white/30 transition-all"
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 'resize':
        return (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Resize functionality coming soon...</p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Width"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400"
              />
              <input
                type="number"
                placeholder="Height"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white placeholder-gray-400"
              />
              <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl">
                Apply Resize
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl mb-6"
          >
            <ImageIcon className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Image <span className="text-orange-600">Editor</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional image editing tools with real-time preview and adjustments
          </p>
        </motion.div>

        {!selectedImage ? (
          /* Upload Section */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div
              className={`glass rounded-3xl p-12 border-2 border-dashed text-center transition-all duration-300 ${
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
              >
                <ImageIcon className="h-20 w-20 text-orange-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Upload Image to Edit
                </h3>
                <p className="text-gray-400 mb-6">
                  Supports JPG, PNG, GIF, WebP formats up to 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-2xl hover:scale-105 transition-transform inline-flex items-center space-x-2"
                >
                  <Upload className="h-5 w-5" />
                  <span>Choose Image</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Editor Interface */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Image Preview */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3 bg-white rounded-3xl p-8 border-2 border-orange-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Image Preview</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setOriginalImage(null);
                    }}
                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-white hover:bg-white/20 transition-colors"
                  >
                    New Image
                  </button>
                  <button
                    onClick={downloadImage}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:scale-105 transition-transform flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
              
              <div className="relative bg-white/5 rounded-2xl p-4 min-h-96 flex items-center justify-center">
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Edit preview"
                  style={applyAdjustments()}
                  className="max-w-full max-h-96 object-contain rounded-lg shadow-2xl"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </motion.div>

            {/* Controls Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-6 border border-white/10 h-fit"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Edit Tools</h2>
              
              {/* Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-all flex items-center space-x-1 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-600 to-orange-600 text-white'
                        : 'bg-white/10 text-gray-600 hover:bg-white/20'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Tab Content */}
              <div className="min-h-64">
                {renderTabContent()}
              </div>
            </motion.div>
          </div>
        )}

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Powerful Editing Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Sliders, title: 'Adjustments', desc: 'Brightness, contrast, saturation' },
              { icon: Filter, title: 'Filters', desc: 'Vintage, sepia, and artistic effects' },
              { icon: Crop, title: 'Crop & Resize', desc: 'Perfect dimensions for any use' },
              { icon: Palette, title: 'Color Tools', desc: 'Hue shifts and color corrections' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center border border-white/10"
              >
                <feature.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ImageEditor;





