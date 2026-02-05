/**
 * Application-wide Constants
 * Centralized configuration for constants used throughout the application
 * Following Single Source of Truth principle - define once, use everywhere
 */

/**
 * Contact Information
 * Used across Footer, Privacy Policy, Terms of Service, Contact page, etc.
 */
export const CONTACT_INFO = {
  email: "scholarx.eg@gmail.com",
  supportEmail: "support@scholarx.com", // For legal/policy pages
  phone: "+(20) 1012072516",
  website: "https://scholar-x.org",
  contactPageUrl: "/contact",

  // Email subjects for different purposes
  emailSubjects: {
    privacyInquiry: "Privacy Policy Inquiry",
    termsInquiry: "Terms of Service Inquiry",
    generalSupport: "General Support",
    technicalSupport: "Technical Support",
  },
};

/**
 * Company Information
 */
export const COMPANY_INFO = {
  name: "ScholarX",
  legalName: "ScholarX Educational Platform",
  tagline:
    "Empowering academic success through personalized support and mentorship",
  jurisdiction: "Egypt", // For legal documents
  foundedYear: 2025,
};

/**
 * Social Media Links
 */
export const SOCIAL_LINKS = {
  twitter: "#",
  linkedin: "https://www.linkedin.com/company/scholarx0",
  facebook: "https://www.facebook.com/ScholarX.eg/",
  instagram: "https://www.instagram.com/scholarx.eg/",
};

/**
 * Legal Pages
 */
export const LEGAL_PAGES = {
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
};

/**
 * Theme Colors (consistent across all pages)
 */
export const THEME_COLORS = {
  primary: "#3399CC",
  secondary: "#FF6633",
  lightBg: "#D6EBF5",
  darkText: "#0A1F29",
  grayText: "#555555",
  lightGray: "#808080",
  glassBg: "rgba(255, 255, 255, 0.85)",
};
