import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';

interface FilePreviewProps {
  file: { title: string; fileUrl: string } | null;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  if (!file) return null;

  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.fileUrl);
  const isPdf = /\.pdf$/i.test(file.fileUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">
                  {file.title}
                </h3>
                <p className="text-xs text-gray-500">Medical Document Preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href={file.fileUrl} 
                download={file.title}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </a>
              <a 
                href={file.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Open in new tab"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow overflow-auto p-6 bg-gray-50 flex items-center justify-center">
            {isImage ? (
              <img 
                src={file.fileUrl} 
                alt={file.title} 
                className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : isPdf ? (
              <iframe 
                src={`${file.fileUrl}#toolbar=0`} 
                className="w-full h-full min-h-[60vh] rounded-lg border border-gray-200 bg-white"
                title={file.title}
              />
            ) : (
              <div className="text-center p-12">
                <div className="bg-white p-8 rounded-3xl shadow-sm inline-block mb-4">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-4">Preview not available for this file type</p>
                  <a 
                    href={file.fileUrl} 
                    download={file.title}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                  >
                    <Download className="h-5 w-5" />
                    Download to View
                  </a>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
