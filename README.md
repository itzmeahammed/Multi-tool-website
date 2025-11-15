# Multi-Tool Website

A modern, feature-rich web application providing a comprehensive suite of tools for productivity, content creation, and data processing. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

### AI Tools
- Text summarization and analysis
- AI-powered content generation
- Natural language processing utilities

### Audio & Video Tools
- Audio format conversion
- Video processing and editing
- Audio extraction from videos
- Text-to-speech conversion

### Document Tools
- PDF conversion and manipulation
- Document format conversion
- PDF merging and splitting
- Document compression

### Image Tools
- Image editor with advanced features
- Image format conversion
- Image compression and optimization
- QR code generation
- Barcode generation

### Utility Tools
- JSON formatter and validator
- Base64 encoding/decoding
- URL encoding/decoding
- Hash generation (MD5, SHA-1, SHA-256)
- Password generator
- Unit converter
- Color converter
- Timezone converter

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Routing**: React Router DOM 7.8.0
- **Animations**: Framer Motion 12.23.12
- **Icons**: Lucide React 0.539.0
- **PDF Processing**: jsPDF, pdf-lib
- **QR Code**: qrcode, qrcode.react
- **Barcode**: jsbarcode
- **Archive**: jszip
- **Encryption**: crypto-js

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone git@github.com:itzmeahammed/Multi-tool-website.git
cd Multi-tool-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── pages/
│   ├── AITools.tsx
│   ├── AudioVideoTools.tsx
│   ├── DocumentTools.tsx
│   ├── ImageTools.tsx
│   ├── UtilityTools.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Home.tsx
│   ├── Landing.tsx
│   └── tools/
│       ├── AudioConverter.tsx
│       ├── ImageEditor.tsx
│       ├── PDFConverter.tsx
│       ├── QRGenerator.tsx
│       ├── TextToSpeech.tsx
│       └── [37 more tool implementations]
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── LoadingSpinner.tsx
├── App.tsx
├── App.css
└── main.tsx
```

## 🎨 Design

The application features a modern, clean design with:
- **Color Palette**: White backgrounds with orange accents (#f97316, #ea580c, #f59e0b)
- **Typography**: Gray text (#374151, #6b7280) for optimal readability
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for interactive elements
- **Accessibility**: WCAG compliant color contrasts and semantic HTML

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🔧 Configuration Files

- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.js` - ESLint configuration
- `postcss.config.js` - PostCSS configuration

## 📦 Dependencies

### Core Dependencies
- react@18.3.1
- react-dom@18.3.1
- react-router-dom@7.8.0
- typescript@5.5.3

### UI & Styling
- tailwindcss@3.4.1
- framer-motion@12.23.12
- lucide-react@0.539.0

### Utilities
- qrcode@1.5.4
- jspdf@3.0.1
- pdf-lib@1.17.1
- jszip@3.10.1
- crypto-js@4.2.0
- jsbarcode@3.12.1

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Developed by Ahammed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue on the GitHub repository.

---

**Repository**: [Multi-tool-website](https://github.com/itzmeahammed/Multi-tool-website)

**Live Demo**: [Coming Soon]

Made with ❤️ by the development team