import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { occupationCategories } from "../data/occupationCategories";
import type { AlumniData } from "../types/alumni";
import { Send, Upload } from "lucide-react";
import { checkNameExists, saveAlumni } from "../lib/api";
import { ProfilePicture } from "./ProfilePicture";
import { toast } from "sonner";

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
  const [customSubField, setCustomSubField] = useState("");
  const [profilePicture, setProfilePicture] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "field") {
      setSelectedField(value);
      setFormData((prev) => ({
        ...prev,
        occupation: {
          field: value,
          subField:
            value === "other"
              ? customSubField
              : occupationCategories[
                  value as keyof typeof occupationCategories
                ][0],
        },
      }));
    } else if (name === "subField") {
      setFormData((prev) => ({
        ...prev,
        occupation: {
          ...prev.occupation!,
          subField: value,
        },
      }));
    } else if (name === "customSubField") {
      setCustomSubField(value);
      setFormData((prev) => ({
        ...prev,
        occupation: {
          ...prev.occupation!,
          subField: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const exists = await checkNameExists(
        formData.firstName!,
        formData.lastName!
      );
      if (exists) {
        toast.error("An alumni with this name already exists");
        return;
      }

      const alumniData = {
        ...formData,
        profilePicture,
        id: Date.now().toString(),
      };

      await saveAlumni(alumniData);
      onSubmit(alumniData);
      toast.success("Profile added successfully!");
    } catch (error) {
      toast.error("Failed to add profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
      onSubmit={handleSubmit}
    >
      <div className="mb-8 flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <ProfilePicture
            src={profilePicture}
            alt="Profile Preview"
            className="w-full h-full rounded-full"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <Upload size={20} />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="form-input px-4 py-2.5 rounded-lg border border-gray-300"
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
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="form-input px-4 py-2.5 rounded-lg border border-gray-300"
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
            value={formData.email}
            onChange={handleInputChange}
            required
            className="form-input px-4 py-2.5 rounded-lg border border-gray-300"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="form-input px-4 py-2.5 rounded-lg border border-gray-300"
            placeholder="Enter your phone number"
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
            required
            className="form-select px-4 py-2.5 rounded-lg border border-gray-300"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Occupation Field
          </label>
          <select
            name="field"
            value={selectedField}
            onChange={handleInputChange}
            required
            className="form-select px-4 py-2.5 rounded-lg border border-gray-300"
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
          {selectedField === "other" ? (
            <input
              type="text"
              name="customSubField"
              value={customSubField}
              onChange={handleInputChange}
              required
              className="form-input px-4 py-2.5 rounded-lg border border-gray-300"
              placeholder="Enter your sub field"
            />
          ) : (
            <select
              name="subField"
              value={formData.occupation?.subField}
              onChange={handleInputChange}
              required
              className="form-select px-4 py-2.5 rounded-lg border border-gray-300"
            >
              {occupationCategories[
                selectedField as keyof typeof occupationCategories
              ].map((subField) => (
                <option key={subField} value={subField}>
                  {subField}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Attending Alumni Meet 2024-25
          </label>
          <select
            name="attendingMeet"
            value={formData.attendingMeet}
            onChange={handleInputChange}
            required
            className="form-select px-4 py-2.5 rounded-lg border border-gray-300"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      <div className="form-group mt-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Message (Optional)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          className="form-textarea px-4 py-2.5 rounded-lg border border-gray-300 w-full"
          rows={4}
          placeholder="Share a message with your fellow alumni..."
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Send size={20} />
          Submit Profile
        </button>
      </div>
    </motion.form>
  );
}
