import React from "react";
import { motion } from "framer-motion";
import type { AlumniData } from "../types/alumni";

interface OccupationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alumni: AlumniData[];
}

export function OccupationTabs({
  activeTab,
  setActiveTab,
  alumni,
}: OccupationTabsProps) {
  // Get unique occupation fields from alumni data
  const occupations = [
    "All",
    ...new Set(alumni.map((a) => a.occupation.field)),
  ].sort();

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 min-w-max p-1 bg-gray-100 rounded-lg">
        {occupations.map((occupation) => (
          <motion.button
            key={occupation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(occupation)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === occupation
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {occupation.charAt(0).toUpperCase() + occupation.slice(1)}
            <span className="ml-2 text-xs text-gray-500">
              (
              {occupation === "All"
                ? alumni.length
                : alumni.filter((a) => a.occupation.field === occupation)
                    .length}
              )
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
