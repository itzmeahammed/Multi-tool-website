import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, Twitter, Linkedin, Mail, Zap } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' }
  ];

  const toolCategories = [
    { name: 'Document Tools', href: '/document-tools' },
    { name: 'Image Tools', href: '/image-tools' },
    { name: 'Audio/Video Tools', href: '/audio-video-tools' },
    { name: 'AI Tools', href: '/ai-tools' },
    { name: 'Utility Tools', href: '/utility-tools' }
  ];

  return (
    <footer className="relative mt-20 bg-gray-50 border-t border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 mb-4"
            >
              <div className="relative">
                <Zap className="h-8 w-8 text-orange-500" />
                <div className="absolute inset-0 h-8 w-8 text-orange-400 animate-pulse opacity-50">
                  <Zap className="h-8 w-8" />
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-600">ToolVault</span>
            </motion.div>
            <p className="text-gray-600 mb-6 max-w-md">
              Your ultimate productivity companion. Access 25+ powerful tools for document processing, 
              image editing, AI assistance, and much more - all in one beautiful platform.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2 rounded-lg bg-orange-100 border border-orange-200 text-orange-600 hover:bg-orange-200 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Tool Categories</h3>
            <ul className="space-y-2">
              {toolCategories.map((category, index) => (
                <motion.li
                  key={category.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <a 
                    href={category.href} 
                    className="text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    {category.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-600">
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <a href="/about" className="hover:text-orange-600 transition-colors">About Us</a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <a href="/contact" className="hover:text-orange-600 transition-colors">Contact</a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <a href="#" className="hover:text-orange-600 transition-colors">Privacy Policy</a>
              </motion.li>
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <a href="#" className="hover:text-orange-600 transition-colors">Terms of Service</a>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-orange-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            © {currentYear} ToolVault. Made with{' '}
            <Heart className="inline h-4 w-4 text-red-500 animate-pulse" /> for productivity.
          </p>
          <p className="text-gray-600 text-sm">
            Powered by modern web technologies
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;