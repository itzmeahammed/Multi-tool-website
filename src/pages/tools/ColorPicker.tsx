import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Palette, Droplet, Sun, Moon, Copy } from 'lucide-react';
import convert from 'color-convert';

const ColorPicker = () => {
  const [color, setColor] = useState('#8A2BE2'); // Start with a nice purple

  const colorValues = useMemo(() => {
    try {
      const hex = color;
      const rgb = convert.hex.rgb(hex);
      const hsl = convert.hex.hsl(hex);
      return { hex, rgb: `rgb(${rgb.join(', ')})`, hsl: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` };
    } catch (e) {
      return { hex: color, rgb: 'Invalid', hsl: 'Invalid' };
    }
  }, [color]);

  const colorPalette = useMemo(() => {
    try {
      const hsl = convert.hex.hsl(color);
      return {
        complementary: `hsl(${(hsl[0] + 180) % 360}, ${hsl[1]}%, ${hsl[2]}%)`,
        analogous1: `hsl(${(hsl[0] + 30) % 360}, ${hsl[1]}%, ${hsl[2]}%)`,
        analogous2: `hsl(${(hsl[0] - 30 + 360) % 360}, ${hsl[1]}%, ${hsl[2]}%)`,
        triadic1: `hsl(${(hsl[0] + 120) % 360}, ${hsl[1]}%, ${hsl[2]}%)`,
        triadic2: `hsl(${(hsl[0] - 120 + 360) % 360}, ${hsl[1]}%, ${hsl[2]}%)`,
      };
    } catch (e) {
      return {};
    }
  }, [color]);

  const getLuminance = (c: string) => {
      const rgb = convert.hex.rgb(c);
      const a = rgb.map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }

  const contrastRatio = useMemo(() => {
      try {
          const lum1 = getLuminance(color);
          const lum2 = getLuminance('#ffffff');
          const lum3 = getLuminance('#000000');
          const ratioWhite = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
          const ratioBlack = (Math.max(lum1, lum3) + 0.05) / (Math.min(lum1, lum3) + 0.05);
          return { white: ratioWhite.toFixed(2), black: ratioBlack.toFixed(2) };
      } catch (e) {
          return { white: 'N/A', black: 'N/A' };
      }
  }, [color]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl mb-6">
                <Palette className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Color <span className="gradient-text-pink">Picker</span></h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Pick, convert, and harmonize colors with ease.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1 bg-white rounded-3xl p-8 border-2 border-orange-100 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-white mb-6">Select Color</h2>
                <div className="relative w-48 h-48">
                    <motion.div className="absolute inset-0 rounded-full border-4 border-white/20" style={{ background: color }} />
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
                <div className="w-full mt-6 space-y-4">
                    {Object.entries(colorValues).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center bg-black/20 p-3 rounded-lg">
                            <span className="text-gray-600 font-bold uppercase">{key}</span>
                            <span className="text-white font-mono">{value}</span>
                            <button onClick={() => copyToClipboard(value)}><Copy className="h-5 w-5 text-gray-400 hover:text-white"/></button>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-orange-100">
                <h2 className="text-2xl font-bold text-white mb-6">Color Harmony & Tools</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Palette</h3>
                        <div className="space-y-2">
                            {Object.entries(colorPalette).map(([name, c]) => (
                                <div key={name} className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-white/30" style={{ backgroundColor: c as string }}></div>
                                    <span className="text-gray-600 capitalize">{name.replace(/\d/g, '')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Gradient</h3>
                        <div className="w-full h-24 rounded-lg" style={{ background: `linear-gradient(to right, ${color}, ${colorPalette.complementary})` }}></div>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold text-white mb-3">Contrast Check (vs White/Black)</h3>
                        <div className="flex justify-around bg-black/20 p-4 rounded-lg">
                            <div className="text-center">
                                <Sun className="mx-auto h-8 w-8 text-white mb-1"/>
                                <span className={`font-bold text-2xl ${parseFloat(contrastRatio.white) >= 4.5 ? 'text-green-400' : 'text-red-400'}`}>{contrastRatio.white}</span>
                                <span className="text-xs text-gray-400 block">vs White</span>
                            </div>
                            <div className="text-center">
                                <Moon className="mx-auto h-8 w-8 text-white mb-1"/>
                                <span className={`font-bold text-2xl ${parseFloat(contrastRatio.black) >= 4.5 ? 'text-green-400' : 'text-red-400'}`}>{contrastRatio.black}</span>
                                <span className="text-xs text-gray-400 block">vs Black</span>
                            </div>
                        </div>
                         <p className="text-xs text-gray-500 mt-2 text-center">WCAG AA requires a contrast ratio of at least 4.5:1 for normal text.</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;


