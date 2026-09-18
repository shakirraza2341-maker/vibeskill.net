export interface Job {
  id: string;
  company_name: string;
  title: string;
  description1: string;
  description2: string;
  category: string;
  required: string;
  minimum_salary?: number;
  maximum_salary?: number;
  country: string;
  city: string;
  location: string;
  remote_available: boolean;
  skills: string[];
  apply_url: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface JobFormData {
  company_name: string;
  title: string;
  description1: string;
  description2: string;
  category: string;
  required: string;
  minimum_salary?: number;
  maximum_salary?: number;
  country: string;
  city: string;
  location: string;
  remote_available: boolean;
  skills: string[];
  apply_url?: string;
}

export const JOB_CATEGORIES = [
  "Frontend Development",
   "Teaching",
  "Backend Development",
  "Full Stack Development",
  "Mobile Development",
  "DevOps",
  "Data Science",
  "Machine Learning",
  "Cloud Engineering",
  "QA & Testing",
  "UI/UX Design",
  "Product Management",
  "Project Management",
  "Business Analysis",
  "Business Development",
  "AI & Data Engineering",
  "Account & Finance",
  "Operations",
 "Office Administration",
 "Information Technology",
  "Marketing",
  "Database Administration",
  "Security Engineering",
  "Leadership & Management",
  "Content Writing",
  "Leads Generation",
  "Technical Writing",
  "HR",
  "Sales",
  "Customer Support",
  "Digital Marketing",
  "Other",
];

export interface ValidationErrors {
  [key: string]: string;
}

export const validateJobForm = (data: Partial<JobFormData>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.company_name?.trim()) {
    errors.company_name = "Company name is required";
  } else if (data.company_name.trim().length < 2) {
    errors.company_name = "Company name must be at least 2 characters";
  } else if (data.company_name.trim().length > 100) {
    errors.company_name = "Company name must not exceed 100 characters";
  }

  if (!data.category?.trim()) {
    errors.category = "Job category is required";
  } else if (!JOB_CATEGORIES.includes(data.category.trim())) {
    errors.category = "Please select a valid job category";
  }

  if (!data.title?.trim()) {
    errors.title = "Job title is required";
  } else if (data.title.trim().length < 3) {
    errors.title = "Job title must be at least 3 characters";
  } else if (data.title.trim().length > 100) {
    errors.title = "Job title must not exceed 100 characters";
  }

  if (!data.description1?.trim()) {
    errors.description1 = "Job description is required";
  } else if (data.description1.trim().length < 10) {
    errors.description1 = "Job description must be at least 10 characters";
  } else if (data.description1.trim().length > 2000) {
    errors.description1 = "Job description must not exceed 2000 characters";
  }

  if (!data.description2?.trim()) {
    errors.description2 = "Additional job description is required";
  } else if (data.description2.trim().length < 10) {
    errors.description2 = "Additional job description must be at least 10 characters";
  } else if (data.description2.trim().length > 2000) {
    errors.description2 = "Additional job description must not exceed 2000 characters";
  }

  if (data.minimum_salary !== undefined && data.minimum_salary < 0) {
    errors.minimum_salary = "Minimum salary cannot be negative";
  }

  if (data.maximum_salary !== undefined && data.maximum_salary < 0) {
    errors.maximum_salary = "Maximum salary cannot be negative";
  }

  if (
    data.minimum_salary !== undefined &&
    data.maximum_salary !== undefined &&
    data.maximum_salary < data.minimum_salary
  ) {
    errors.maximum_salary = "Maximum salary must be greater than minimum salary";
  }

  if (!data.country?.trim()) {
    errors.country = "Country is required";
  } else if (data.country.trim().length > 100) {
    errors.country = "Country name is too long";
  }

  if (!data.city?.trim()) {
    errors.city = "City is required";
  } else if (data.city.trim().length > 100) {
    errors.city = "City name is too long";
  }

  if (!data.location?.trim()) {
    errors.location = "Location details are required";
  } else if (data.location.trim().length < 3) {
    errors.location = "Location must be at least 3 characters";
  } else if (data.location.trim().length > 200) {
    errors.location = "Location is too long";
  }

  if (typeof data.remote_available !== "boolean") {
    errors.remote_available = "Remote availability selection is required";
  }

  if (
    !data.skills ||
    !Array.isArray(data.skills) ||
    data.skills.length === 0
  ) {
    errors.skills = "At least one skill is required";
  } else if (data.skills.length > 20) {
    errors.skills = "Maximum 20 skills allowed";
  } else {
    const invalidSkills = data.skills.filter(
      (skill) => !skill?.trim() || skill.trim().length > 50
    );
    if (invalidSkills.length > 0) {
      errors.skills = "Each skill must be 1-50 characters";
    }
  }

  return errors;
};

export const formatSalary = (salary?: number): string => {
  if (salary === undefined || salary === null) return "Not disclosed";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(salary);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
