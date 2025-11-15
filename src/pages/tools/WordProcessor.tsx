
import { motion } from 'framer-motion';
import { File, Wrench } from 'lucide-react';

const WordProcessor = () => {
  return (
    <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-12"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ delay: 0.2 }} 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl mb-6"
          >
            <File className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Word <span className="gradient-text-blue">Processor</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Advanced tools for Word documents are on the way.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="bg-white rounded-3xl p-8 border-2 border-orange-100 max-w-lg mx-auto"
        >
          <div className="flex flex-col items-center text-center">
            <Wrench className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Under Construction</h3>
            <p className="text-gray-400 mb-6">
              We are currently building a powerful Word document processor. This feature will include DOCX to PDF conversion, text extraction, and more. Please check back soon!
            </p>
            <p className="text-sm text-gray-500">
              Thank you for your patience.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WordProcessor;



