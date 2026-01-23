/**
 * Type definitions for Event Registration feature
 * Provides comprehensive typing for form data, props, and API interactions
 */

export interface EventRegistrationFormData {
  fullName: string;
  location: string;
  age: number;
  studyLevel: StudyLevel;
  university?: string;
  faculty?: string;
  email: string;
  whatsAppNumber: string;
  interests: string[];
}

export type StudyLevel =
  | "High School"
  | "Undergraduate"
  | "Graduated"
  | "Other"
  | "";

export interface ServiceCardProps {
  icon?: React.ComponentType;
  title: string;
  description: string;
  onRegisterClick: () => void;
  iconColor?: string;
  iconBgColor?: string;
}

export interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventRegistrationFormData) => Promise<void>;
  eventTitle?: string;
}

export interface StudyLevelOption {
  value: StudyLevel;
  label: string;
}

export interface InterestOption {
  value: string;
  label: string;
}

/**
 * API Response types
 */
export interface EventRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    registrationId: string;
    confirmationEmail: string;
  };
  error?: string;
}

/**
 * Form validation error structure
 */
export interface FormErrors {
  fullName?: string;
  location?: string;
  age?: string;
  studyLevel?: string;
  university?: string;
  faculty?: string;
  email?: string;
  whatsAppNumber?: string;
  interests?: string;
}
