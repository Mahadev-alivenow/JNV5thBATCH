import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import type { AlumniData } from "../types/alumni";
import { Send, Upload } from "lucide-react";
import { checkNameExists, saveAlumni } from "../lib/api";
import { ProfilePicture } from "./ProfilePicture";
import { toast } from "sonner";
import { occupationCategories } from "../lib/occupationCategories";

interface AlumniFormProps {
  existingAlumni: AlumniData[];
  onSubmit: (data: Partial<AlumniData>) => void;
}

export function AlumniForm({ onSubmit }: AlumniFormProps) {
  const [formData, setFormData] = useState<Partial<AlumniData>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "male",
    occupation: { field: "engineer", subField: "Software Development" },
    message: "",
    attendingMeet: "No",
  });
  const [selectedField, setSelectedField] = useState("engineer");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleFieldChange = (field: string) => {
    setSelectedField(field);
    setFormData((prev) => ({
      ...prev,
      occupation: {
        field,
        subField:
          occupationCategories[field as keyof typeof occupationCategories][0],
      },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "subField") {
      setFormData((prev) => ({
        ...prev,
        occupation: { ...prev.occupation!, subField: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        setFormData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nameExists = await checkNameExists(
        formData.firstName!,
        formData.lastName!
      );
      if (nameExists) {
        toast.error("An alumni with this name already exists");
        return;
      }

      await saveAlumni(formData);
      onSubmit(formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "male",
        occupation: { field: "engineer", subField: "Software Development" },
        message: "",
      });
      setProfilePicture("");
    } catch (error) {
      toast.error("Failed to save alumni data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
      onSubmit={handleSubmit}
    >
      <div className="mb-8 flex justify-center">
        <div className="relative group">
          <ProfilePicture
            src={profilePicture}
            alt={`${formData.firstName} ${formData.lastName}`}
            className="w-32 h-32 rounded-full ring-4 ring-blue-50 transition-transform duration-300 group-hover:scale-105"
          />
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Upload size={18} />
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter your first name"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter your last name"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleInputChange}
            className="form-input w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="(123) 456-7890"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form-select w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Field
          </label>
          <select
            value={selectedField}
            onChange={(e) => handleFieldChange(e.target.value)}
            className="form-select w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
          >
            {Object.keys(occupationCategories).map((field) => (
              <option key={field} value={field}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Sub Field
          </label>
          <select
            name="subField"
            value={formData.occupation?.subField}
            onChange={handleInputChange}
            className="form-select w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
          >
            {occupationCategories[
              selectedField as keyof typeof occupationCategories
            ].map((subField) => (
              <option key={subField} value={subField}>
                {subField}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Attending Alumni Meet 2024-25
          </label>
          <select
            name="attendingMeet"
            value={formData.attendingMeet}
            onChange={handleInputChange}
            className="form-select w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Message (Optional)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows={3}
          className="form-textarea w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
          placeholder="Share a message with your fellow alumni..."
        />
      </div>

      <div className="mt-8">
        <motion.button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Send size={20} />
          {isSubmitting ? "Saving..." : "Save Profile"}
        </motion.button>
      </div>
    </motion.form>
  );
}
