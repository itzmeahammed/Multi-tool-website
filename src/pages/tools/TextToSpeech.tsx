import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Volume2, 
  Play, 
  Pause, 
  Download, 
  Settings, 
  Languages, 
  User,
  Volume,
  Clock,
  FileAudio
} from 'lucide-react';

interface Voice {
  name: string;
  lang: string;
  gender: 'male' | 'female';
  accent?: string;
}

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<Voice>({
    name: 'Google US English',
    lang: 'en-US',
    gender: 'female'
  });
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const voices: Voice[] = [
    { name: 'Google US English', lang: 'en-US', gender: 'female' },
    { name: 'Google US English', lang: 'en-US', gender: 'male' },
    { name: 'Google UK English', lang: 'en-GB', gender: 'female' },
    { name: 'Google UK English', lang: 'en-GB', gender: 'male' },
    { name: 'Google Spanish', lang: 'es-ES', gender: 'female' },
    { name: 'Google Spanish', lang: 'es-ES', gender: 'male' },
    { name: 'Google French', lang: 'fr-FR', gender: 'female' },
    { name: 'Google French', lang: 'fr-FR', gender: 'male' },
    { name: 'Google German', lang: 'de-DE', gender: 'female' },
    { name: 'Google German', lang: 'de-DE', gender: 'male' },
    { name: 'Google Italian', lang: 'it-IT', gender: 'female' },
    { name: 'Google Japanese', lang: 'ja-JP', gender: 'female' },
    { name: 'Google Korean', lang: 'ko-KR', gender: 'female' },
    { name: 'Google Mandarin', lang: 'zh-CN', gender: 'female' },
  ];

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German', flag: '🇩🇪' },
    { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
    { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
    { code: 'zh-CN', name: 'Chinese', flag: '🇨🇳' },
  ];

  const sampleTexts = {
    'en-US': 'Hello! Welcome to our text-to-speech converter. This tool can help you convert any text into natural-sounding speech.',
    'es-ES': 'Hola! Bienvenido a nuestro convertidor de texto a voz. Esta herramienta puede ayudarte a convertir cualquier texto en voz natural.',
    'fr-FR': 'Bonjour! Bienvenue dans notre convertisseur de texte en parole. Cet outil peut vous aider à convertir n\'importe quel texte en parole naturelle.',
    'de-DE': 'Hallo! Willkommen bei unserem Text-zu-Sprache-Konverter. Dieses Tool kann Ihnen dabei helfen, jeden Text in natürlich klingende Sprache umzuwandeln.',
    'it-IT': 'Ciao! Benvenuto nel nostro convertitore da testo a voce. Questo strumento può aiutarti a convertire qualsiasi testo in un discorso dal suono naturale.',
  };

  // Simulate text-to-speech generation (in real app, you'd use a TTS API)
  const generateSpeech = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would:
    // 1. Send text to TTS API (Google Cloud TTS, Amazon Polly, etc.)
    // 2. Receive audio file/blob
    // 3. Create object URL for playback
    
    // For demo, we'll create a placeholder audio URL
    const demoAudioUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUSBSth0PLLeSsFJH7K8N+QQAkUXrTp66hVFApGod/wvmYPBSxd0fLNeSsFJITR8+KMRgsTXLPr6J5DEAxKq+Pztm4bBTiR1/LL0_LPeS4FJFzM8N+QQAoUX7Tn56hVFApHod/wvmYPBSxd0fLNeSsFJITR8+KMRgsTXLPr6J5DEAxKq+Pztm4bBTiR1/LL';
    setAudioUrl(demoAudioUrl);
    setIsGenerating(false);
  };

  const playPauseAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `speech-${Date.now()}.wav`;
    link.click();
  };

  const loadSampleText = (langCode: string) => {
    const sample = sampleTexts[langCode as keyof typeof sampleTexts] || sampleTexts['en-US'];
    setText(sample);
    
    // Update selected voice to match language
    const voiceForLang = voices.find(v => v.lang === langCode);
    if (voiceForLang) {
      setSelectedVoice(voiceForLang);
    }
  };

  const getVoicesForLanguage = (langCode: string) => {
    return voices.filter(voice => voice.lang === langCode);
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
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6"
          >
            <Volume2 className="h-10 w-10 text-white" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Text to <span className="text-orange-600">Speech</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert your text into natural-sounding speech with multiple languages and voices
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-3xl p-8 border-2 border-orange-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Enter Your Text</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {text.length}/5000 characters
                </span>
              </div>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 5000))}
              placeholder="Enter the text you want to convert to speech..."
              className="w-full h-64 px-6 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 resize-none text-lg leading-relaxed"
            />

            {/* Sample Texts */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-4">Quick Start - Sample Texts:</h3>
              <div className="flex flex-wrap gap-2">
                {languages.slice(0, 5).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => loadSampleText(lang.code)}
                    className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white/20 transition-colors flex items-center space-x-2"
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={generateSpeech}
              disabled={!text.trim() || isGenerating}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-600 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Generating Speech...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Volume2 className="h-5 w-5" />
                  <span>Generate Speech</span>
                </div>
              )}
            </motion.button>

            {/* Audio Player */}
            {audioUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={playPauseAudio}
                      className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    <div>
                      <div className="text-white font-medium">Generated Speech</div>
                      <div className="text-sm text-gray-400">
                        {selectedVoice.name} • {selectedVoice.lang} • {selectedVoice.gender}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={downloadAudio}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-xl hover:scale-105 transition-transform flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </button>
                </div>
                
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 border-2 border-orange-100 h-fit"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Voice Settings</h2>
            
            {/* Language Selection */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-600 mb-4 flex items-center space-x-2">
                <Languages className="h-5 w-5" />
                <span>Language</span>
              </label>
              <select
                value={selectedVoice.lang}
                onChange={(e) => {
                  const langCode = e.target.value;
                  const voiceForLang = voices.find(v => v.lang === langCode);
                  if (voiceForLang) {
                    setSelectedVoice(voiceForLang);
                  }
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-white focus:outline-none focus:border-orange-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-gray-800">
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice Selection */}
            <div className="mb-8">
              <label className="block text-lg font-medium text-gray-600 mb-4 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Voice</span>
              </label>
              <div className="space-y-2">
                {getVoicesForLanguage(selectedVoice.lang).map((voice, index) => (
                  <button
                    key={`${voice.lang}-${voice.gender}-${index}`}
                    onClick={() => setSelectedVoice(voice)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      selectedVoice.gender === voice.gender && selectedVoice.lang === voice.lang
                        ? 'bg-gradient-to-r from-orange-600 to-orange-600 border-orange-500 text-white'
                        : 'bg-white/5 border-white/20 text-gray-600 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-sm opacity-70 capitalize">{voice.gender}</div>
                      </div>
                      <div className="text-2xl">
                        {voice.gender === 'male' ? '🙋‍♂️' : '🙋‍♀️'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Speed Control */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Speed</span>
                </label>
                <span className="text-sm text-orange-600">{speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Pitch Control */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Pitch</span>
                </label>
                <span className="text-sm text-orange-600">{pitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Volume Control */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                  <Volume className="h-4 w-4" />
                  <span>Volume</span>
                </label>
                <span className="text-sm text-orange-600">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Settings Summary */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <h3 className="text-white font-medium mb-3">Current Settings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-orange-600">{selectedVoice.lang}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Voice:</span>
                  <span className="text-orange-600 capitalize">{selectedVoice.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Speed:</span>
                  <span className="text-orange-600">{speed.toFixed(1)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Pitch:</span>
                  <span className="text-orange-600">{pitch.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Advanced Text-to-Speech Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Languages, title: 'Multiple Languages', desc: '9+ languages with native voices' },
              { icon: User, title: 'Voice Variety', desc: 'Male and female voice options' },
              { icon: Settings, title: 'Customizable', desc: 'Adjust speed, pitch, and volume' },
              { icon: FileAudio, title: 'High Quality', desc: 'Crystal clear audio output' }
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

export default TextToSpeech;




