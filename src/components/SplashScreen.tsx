import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';

const quotes = [
  "Your health, visualized.",
  "Unified Intelligence for a Healthier India.",
  "Precision care, powered by data.",
  "Connecting India's healthcare ecosystem.",
  "Empowering patients, enabling doctors."
];

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIdx((prev) => (prev + 1) % quotes.length);
    }, 1500);

    const finishTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinish, 1000); // Wait for exit animation
    }, 4000);

    return () => {
      clearInterval(quoteTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background patterns */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 100 Q 250 50 500 100 T 1000 100" fill="none" stroke="#1E3A8A" strokeWidth="2" />
              <path d="M0 150 Q 250 100 500 150 T 1000 150" fill="none" stroke="#14B8A6" strokeWidth="2" />
            </svg>
          </div>

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-8"
            >
              <div className="h-24 w-24 gradient-blue-teal rounded-[24px] flex items-center justify-center shadow-2xl shadow-medical-blue/20">
                <Activity className="h-12 w-12 text-white" />
              </div>
            </motion.div>

            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl font-black text-medical-blue tracking-tighter mb-4 flex items-center gap-2"
            >
              HealthGraph <span className="text-teal-accent">India</span>
            </motion.h1>

            <div className="h-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIdx}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="text-slate-400 font-medium text-center"
                >
                  {quotes[quoteIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute bottom-20 h-1 bg-slate-100 rounded-full overflow-hidden"
          >
            <motion.div 
              className="h-full gradient-blue-teal"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
