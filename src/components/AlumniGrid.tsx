import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { AlumniData } from "../types/alumni";
import { Briefcase, Phone, Download, Calendar } from "lucide-react";
import { ProfilePicture } from "./ProfilePicture";
import { formatPhoneNumber } from "../utils/validation";
import { OccupationTabs } from "./OccupationTabs";
import { toast } from "sonner";

interface AlumniGridProps {
  alumni: AlumniData[];
}

export function AlumniGrid({ alumni }: AlumniGridProps) {
  const [activeTab, setActiveTab] = useState("All");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  const filteredAlumni =
    activeTab === "All"
      ? alumni
      : alumni.filter(
          (person) =>
            person.occupation.field.toLowerCase() === activeTab.toLowerCase()
        );

  const handleDownload = () => {
    const data = filteredAlumni.map(
      ({ firstName, lastName, email, phone, occupation, attendingMeet }) => ({
        "First Name": firstName,
        "Last Name": lastName,
        Email: email,
        Phone: phone,
        Occupation: `${occupation.field} - ${occupation.subField}`,
        "Attending Meet": attendingMeet,
      })
    );

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "alumni-data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Alumni data downloaded successfully!");
  };

  return (
    <div ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Alumni Directory</h2>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={20} />
          Download Data
        </button>
      </div>

      <OccupationTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alumni={alumni}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlumni.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No alumni profiles found for this occupation.
          </div>
        ) : (
          filteredAlumni.map((person, index) => (
            <motion.div
              key={person.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <ProfilePicture
                    src={person.profilePicture}
                    alt={`${person.firstName} ${person.lastName}`}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {person.firstName} {person.lastName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase size={16} className="mr-1" />
                      {person.occupation.field} - {person.occupation.subField}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <a
                    href={`mailto:${person.email}`}
                    className="block text-blue-600 hover:underline"
                  >
                    {person.email}
                  </a>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <a href={`tel:${person.phone}`} className="hover:underline">
                      {formatPhoneNumber(person.phone)}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} />
                    <span>Attending Meet: {person.attendingMeet}</span>
                  </div>
                </div>

                {person.message && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
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
