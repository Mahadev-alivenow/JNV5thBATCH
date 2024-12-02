import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlumniForm } from "./components/AlumniForm";
import { AlumniGrid } from "./components/AlumniGrid";
import { Users, UserPlus } from "lucide-react";
import type { AlumniData } from "./types/alumni";
import { Toast } from "./components/Toast";
import { toast } from "sonner";
import { HeroSection } from "./components/HeroSection";
import { getAlumni } from "./lib/api";
import { useLoading } from "./context/LoadingContext";

export default function App() {
  const [activeTab, setActiveTab] = useState<"view" | "add">("view");
  const [alumni, setAlumni] = useState<AlumniData[]>([]);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchAlumni = async () => {
      setLoading(true);
      try {
        const data = await getAlumni();
        setAlumni(data);
      } catch (error) {
        toast.error("Failed to load alumni data");
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, [setLoading]);

  const handleSubmit = async (data: Partial<AlumniData>) => {
    setLoading(true);
    try {
      const newAlumni: AlumniData = {
        id: Date.now().toString(),
        ...(data as AlumniData),
      };
      setAlumni((prev) => [...prev, newAlumni]);
      setActiveTab("view");
      toast.success("Profile added successfully!", {
        description: `Welcome to the alumni network, ${data.firstName}!`,
      });
    } catch (error) {
      toast.error("Failed to add profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toast />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Alumni Network</h1>
        </div>
      </header>

      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("view")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "view"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users size={20} />
            View Alumni
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "add"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <UserPlus size={20} />
            Add Profile
          </motion.button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "view" ? (
            <AlumniGrid alumni={alumni} />
          ) : (
            <AlumniForm existingAlumni={alumni} onSubmit={handleSubmit} />
          )}
        </motion.div>
      </main>
    </div>
  );
}
