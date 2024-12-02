import React from "react";
import { motion } from "framer-motion";

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`inline-block ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full" />
    </motion.div>
  );
}
