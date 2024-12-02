import React from "react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <div className="relative h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/alumni_5th_batch.jpeg"
          alt="JNV 5th Batch Alumni"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            JNV 5th Batch Alumni Network
          </h1>
          <p className="text-xl text-gray-200">
            Celebrating our shared journey from Jawahar Navodaya Vidyalaya.
            Together we learned, grew, and built lifelong bonds. Now, we
            reconnect to share our stories and achievements.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
