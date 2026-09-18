"use client";

import { useState, FormEvent } from "react";
import {
  Job,
  JobFormData,
  ValidationErrors,
  validateJobForm,
  JOB_CATEGORIES,
} from "../../lib/jobs-utils";
import { X } from "lucide-react";

interface JobFormProps {
  job: Job | null;
  isLoading: boolean;
  onSubmit: (data: JobFormData) => Promise<ValidationErrors>;
  onCancel: () => void;
}

const COMMON_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "JavaScript",
  "MongoDB",
  "PostgreSQL",
  "English",
  "Communication",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "REST API",
  "GraphQL",
  "Next.js",
  "Express",
  "Vue.js",
  "Angular",
  "Java",
  "C++",
  "C#",
  "Enthusiasm",
  "Problem Solving",
  "Product Management",
  "Project Management",
  "Go",
  "HR",
  "Customer Support",
  "Digital Marketing",
];

export default function JobForm({
  job,
  isLoading,
  onSubmit,
  onCancel,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    company_name: job?.company_name || "",
    title: job?.title || "",
    description1: job?.description1 || "",
    description2: job?.description2 || "",
    category: job?.category || "",
    required: job?.required || "",
    minimum_salary: job?.minimum_salary,
    maximum_salary: job?.maximum_salary,
    country: job?.country || "",
    city: job?.city || "",
    location: job?.location || "",
    remote_available: job?.remote_available || false,
    skills: job?.skills || [],
    apply_url: job?.apply_url || "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [skillInput, setSkillInput] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? value === ""
              ? undefined
              : Number(value)
            : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill) {
      setErrors((prev) => ({ ...prev, skillInput: "Please enter a skill" }));
      return;
    }
    if (formData.skills.includes(skill)) {
      setErrors((prev) => ({ ...prev, skillInput: "Skill already added" }));
      return;
    }
    if (formData.skills.length >= 20) {
      setErrors((prev) => ({
        ...prev,
        skillInput: "Maximum 20 skills allowed",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill],
    }));
    setSkillInput("");
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.skillInput;
      delete newErrors.skills;
      return newErrors;
    });
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addPredefinedSkill = (skill: string) => {
    if (!formData.skills.includes(skill) && formData.skills.length < 20) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = await onSubmit(formData);
    setErrors(validationErrors);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-6">
        {job ? "Edit Job Listing" : "Create New Job Listing"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Company Name *
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., Acme Corporation"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.company_name && (
            <p className="text-red-400 text-sm mt-1">{errors.company_name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <option value="">Select a category...</option>
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-400 text-sm mt-1">{errors.category}</p>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., Senior React Developer"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.title && (
            <p className="text-red-400 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Description *
          </label>
          <textarea
            name="description1"
            value={formData.description1}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Describe the role, responsibilities, and requirements..."
            rows={5}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
          />
          {errors.description1 && (
            <p className="text-red-400 text-sm mt-1">{errors.description1}</p>
          )}
        </div>

        {/* Description 2 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Job Description *
          </label>
          <textarea
            name="description2"
            value={formData.description2}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Describe the role, responsibilities, and requirements..."
            rows={5}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
          />
          {errors.description2 && (
            <p className="text-red-400 text-sm mt-1">{errors.description2}</p>
          )}
        </div>

        {/* Apply URL */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Apply URL (optional)
          </label>
          <input
            type="text"
            name="apply_url"
            value={formData.apply_url}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., Senior React Developer"
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.apply_url && (
            <p className="text-red-400 text-sm mt-1">{errors.apply_url}</p>
          )}
        </div>

        {/* Required Positions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Required Skills *
          </label>
          <textarea
            name="required"
            value={formData.required}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="e.g., 3"
            rows={3}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          {errors.required && (
            <p className="text-red-400 text-sm mt-1">{errors.required}</p>
          )}
        </div>

        {/* Salary Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Minimum Salary (USD) (optional)
            </label>
            <input
              type="number"
              name="minimum_salary"
              value={formData.minimum_salary ?? ""}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="1000"
              placeholder="0"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.minimum_salary && (
              <p className="text-red-400 text-sm mt-1">
                {errors.minimum_salary}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Maximum Salary (USD) (optional)
            </label>
            <input
              type="number"
              name="maximum_salary"
              value={formData.maximum_salary ?? ""}
              onChange={handleChange}
              disabled={isLoading}
              min="0"
              step="1000"
              placeholder="0"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.maximum_salary && (
              <p className="text-red-400 text-sm mt-1">
                {errors.maximum_salary}
              </p>
            )}
          </div>
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Country *
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., United States"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.country && (
              <p className="text-red-400 text-sm mt-1">{errors.country}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., San Francisco"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.city && (
              <p className="text-red-400 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location Address *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g., Downtown Office"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            {errors.location && (
              <p className="text-red-400 text-sm mt-1">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Remote Available */}
        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="remote_available"
              checked={formData.remote_available}
              onChange={handleChange}
              disabled={isLoading}
              className="w-5 h-5 bg-slate-700 border border-slate-600 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-300">
              Remote work is available
            </span>
          </label>
          {errors.remote_available && (
            <p className="text-red-400 text-sm mt-1">
              {errors.remote_available}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Required Skills * ({formData.skills.length}/20)
          </label>

          {/* Selected Skills */}
          <div className="mb-3 flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-2 text-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  disabled={isLoading}
                  className="hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Skill Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => {
                setSkillInput(e.target.value);
                if (errors.skillInput) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.skillInput;
                    return newErrors;
                  });
                }
              }}
              disabled={isLoading || formData.skills.length >= 20}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), addSkill())
              }
              placeholder="Type skill name and press Enter or click Add"
              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
            <button
              type="button"
              onClick={addSkill}
              disabled={isLoading || formData.skills.length >= 20}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>

          {errors.skillInput && (
            <p className="text-red-400 text-sm mb-3">{errors.skillInput}</p>
          )}
          {errors.skills && (
            <p className="text-red-400 text-sm mb-3">{errors.skills}</p>
          )}

          {/* Common Skills Suggestions */}
          <div>
            <p className="text-xs text-gray-400 mb-2">
              Quick add common skills:
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addPredefinedSkill(skill)}
                  disabled={
                    isLoading ||
                    formData.skills.includes(skill) ||
                    formData.skills.length >= 20
                  }
                  className="px-3 py-1 bg-slate-700 text-gray-300 text-sm rounded hover:bg-slate-600 disabled:opacity-30 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Saving..." : job ? "Update Job" : "Create Job"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-slate-700 text-gray-300 font-semibold rounded-lg hover:bg-slate-600 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
