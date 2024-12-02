import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { AlumniData } from "../types/alumni";
import { Briefcase, Phone, Download, Calendar } from "lucide-react";
import { ProfilePicture } from "./ProfilePicture";
import { formatPhoneNumber } from "../utils/validation";
import { getAlumni } from "../lib/api";
import { toast } from "sonner";

interface AlumniGridProps {
  alumni: AlumniData[];
}

export function AlumniGrid({ alumni: initialAlumni }: AlumniGridProps) {
  const [alumni, setAlumni] = useState<AlumniData[]>(initialAlumni);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await getAlumni();
        setAlumni(data);
      } catch (error) {
        toast.error("Failed to fetch alumni data");
      }
    };

    fetchAlumni();
  }, []);

  const downloadCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Gender",
      "Field",
      "Sub Field",
      "Message",
    ];
    const csvData = alumni.map((person) => [
      person.firstName,
      person.lastName,
      person.email,
      person.phone,
      person.gender,
      person.occupation.field,
      person.occupation.subField,
      person.message || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "alumni_data.csv";
    link.click();
  };

  return (
    <div ref={containerRef}>
      {alumni.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <Download size={20} />
            Download CSV
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alumni.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No alumni profiles found. Be the first to add yours!
          </div>
        ) : (
          alumni.map((person, index) => (
            <motion.div
              key={person.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <ProfilePicture
                    src={person.profilePicture}
                    alt={`${person.firstName} ${person.lastName}`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {person.firstName} {person.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{person.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>{formatPhoneNumber(person.phone)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Briefcase size={16} />
                    <span>
                      {person.occupation.field.charAt(0).toUpperCase() +
                        person.occupation.field.slice(1)}{" "}
                      - {person.occupation.subField}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Attending Meet: {person.attendingMeet || "No"}</span>
                  </div>
                </div>

                {person.message && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-600 italic">
                      "{person.message}"
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
