
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Home from './pages/Home';
import DocumentTools from './pages/DocumentTools';
import ImageTools from './pages/ImageTools';
import AudioVideoTools from './pages/AudioVideoTools';
import AITools from './pages/AITools';
import UtilityTools from './pages/UtilityTools';
import About from './pages/About';
import Contact from './pages/Contact';
import PDFConverter from './pages/tools/PDFConverter';
import ImageEditor from './pages/tools/ImageEditor';
import AudioConverter from './pages/tools/AudioConverter';
import TextToSpeech from './pages/tools/TextToSpeech';
import QRGenerator from './pages/tools/QRGenerator';
import BarcodeGenerator from './pages/tools/BarcodeGenerator';
import PasswordGenerator from './pages/tools/PasswordGenerator';
import HashGenerator from './pages/tools/HashGenerator';
import ColorPicker from './pages/tools/ColorPicker';
import UnitConverter from './pages/tools/UnitConverter';
import CurrencyConverter from './pages/tools/CurrencyConverter';
import WorldClock from './pages/tools/WorldClock';
import Base64Encoder from './pages/tools/Base64Encoder';
import JSONFormatter from './pages/tools/JSONFormatter';
import URLShortener from './pages/tools/URLShortener';
import LoremIpsumGenerator from './pages/tools/LoremIpsumGenerator';
import PDFSplitter from './pages/tools/PDFSplitter';
import PDFCompressor from './pages/tools/PDFCompressor';
import DocumentRotator from './pages/tools/DocumentRotator';
import WordProcessor from './pages/tools/WordProcessor';
import ExcelTools from './pages/tools/ExcelTools';
import FormatConverter from './pages/tools/FormatConverter';
import AudioMerger from './pages/tools/AudioMerger';
import ImageCompressor from './pages/tools/ImageCompressor';
import ImageResizer from './pages/tools/ImageResizer';
import ImageConverter from './pages/tools/ImageConverter';
import ImageRotator from './pages/tools/ImageRotator';
import ImageCropper from './pages/tools/ImageCropper';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <div className="relative">
            <Navbar />
            <main className="relative z-10">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/document-tools" element={<DocumentTools />} />
                <Route path="/image-tools" element={<ImageTools />} />
                <Route path="/audio-video-tools" element={<AudioVideoTools />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/utility-tools" element={<UtilityTools />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/tools/pdf-converter" element={<PDFConverter />} />
                <Route path="/tools/image-editor" element={<ImageEditor />} />
                <Route path="/tools/audio-converter" element={<AudioConverter />} />
                <Route path="/tools/text-to-speech" element={<TextToSpeech />} />
                                <Route path="/tools/qr-generator" element={<QRGenerator />} />
                <Route path="/tools/barcode-generator" element={<BarcodeGenerator />} />
                <Route path="/tools/password-generator" element={<PasswordGenerator />} />
                <Route path="/tools/hash-generator" element={<HashGenerator />} />
                <Route path="/tools/color-picker" element={<ColorPicker />} />
                <Route path="/tools/unit-converter" element={<UnitConverter />} />
                <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
                <Route path="/tools/world-clock" element={<WorldClock />} />
                <Route path="/tools/base64-encoder" element={<Base64Encoder />} />
                <Route path="/tools/json-formatter" element={<JSONFormatter />} />
                <Route path="/tools/url-shortener" element={<URLShortener />} />
                <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
                <Route path="/tools/pdf-splitter" element={<PDFSplitter />} />
                <Route path="/tools/pdf-compressor" element={<PDFCompressor />} />
              <Route path="/tools/document-rotator" element={<DocumentRotator />} />
              <Route path="/tools/word-processor" element={<WordProcessor />} />
              <Route path="/tools/excel-tools" element={<ExcelTools />} />
              <Route path="/tools/format-converter" element={<FormatConverter />} />
                            <Route path="/tools/audio-merger" element={<AudioMerger />} />
                            <Route path="/tools/image-compressor" element={<ImageCompressor />} />
                            <Route path="/tools/image-resizer" element={<ImageResizer />} />
                            <Route path="/tools/image-converter" element={<ImageConverter />} />
                            <Route path="/tools/image-rotator" element={<ImageRotator />} />
              <Route path="/tools/image-cropper" element={<ImageCropper />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;