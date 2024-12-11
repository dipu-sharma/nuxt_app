export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

// Required field validator
export function isRequired(value: string): ValidationResult {
  return value.trim()
    ? { valid: true, error: null }
    : { valid: false, error: "This field is required." };
}

// Email validator
export function isEmail(value: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value)
    ? { valid: true, error: null }
    : { valid: false, error: "Invalid email address." };
}

// Minimum length validator
export function minLength(value: string, length: number): ValidationResult {
  return value.length >= length
    ? { valid: true, error: null }
    : { valid: false, error: `Must be at least ${length} characters.` };
}

// Match another field (e.g., passwords)
export function matches(value: string, compareTo: string): ValidationResult {
  return value === compareTo
    ? { valid: true, error: null }
    : { valid: false, error: "Fields do not match." };
}

// Full name formatter
export function fullName(fname: string, lname: string) {
  if (fname && lname) {
    return `${fname} ${lname}`;
  } else {
    return null;
  }
}

export function isMobile(value: string): ValidationResult {
  const numericValue = value.replace(/[^0-9]/g, ""); // Remove all non-numeric characters
  const mobileRegex = /^[0-9]{10}$/; // Ensure exactly 10 numeric digits
  return mobileRegex.test(numericValue)
    ? { valid: true, error: null }
    : {
        valid: false,
        error: "Invalid mobile number. It should be exactly 10 digits long.",
      };
}

// File validator
export function validateFile(
  file: any,
  allowedExtensions: string[],
  type: string,
  maxSizeInMB: number
): ValidationResult {
  if (!file) {
    return { valid: false, error: "No file selected" };
  }

  const fileExtension = file.name.split(".").pop().toLowerCase();
  const fileSizeInMB = file.size / (1024 * 1024);

  if (!allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error:
        type === "image"
          ? "Please upload a valid image file (.png, .jpeg, .jpg)"
          : type === "pdf"
          ? "Please upload a valid PDF file"
          : type === "excel"
          ? "Please upload a valid Excel file"
          : "Invalid file type",
    };
  }

  if (fileSizeInMB > maxSizeInMB) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of ${maxSizeInMB} MB`,
    };
  }

  return { valid: true, error: "" };
}
