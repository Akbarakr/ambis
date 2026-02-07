import { useEffect } from "react";
import { motion } from "framer-motion";

export function Intro({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md px-8"
      >
        <img 
          src="/assets/logo-transparent.png" 
          alt="Ambi's Cafe Logo" 
          className="w-full h-auto"
        />
      </motion.div>
    </div>
  );
}
