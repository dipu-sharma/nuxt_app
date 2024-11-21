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

export function fullName(fname: string, lname: string) {
  if (fname && lname) {
    return `${fname} ${lname}`;
  } else {
    return null;
  }
}

