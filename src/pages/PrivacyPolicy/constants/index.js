/**
 * Privacy Policy Page Constants
 * Centralized configuration for all privacy policy content
 * Following Single Responsibility Principle - content separated from presentation
 */

import { CONTACT_INFO, COMPANY_INFO } from "../../../utils/constants";

// Hero Section Content
export const PRIVACY_HERO = {
  label: "Legal",
  title: "Privacy Policy",
  subtitle: "Your privacy matters to us",
  lastUpdated: "February 4, 2026",
  description:
    "At ScholarX, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by ScholarX and how we use it.",
};

// Table of Contents for quick navigation
export const TABLE_OF_CONTENTS = [
  { id: "information-collection", label: "Information We Collect" },
  { id: "information-use", label: "How We Use Your Information" },
  { id: "third-party", label: "Third-Party Privacy Policies" },
  { id: "gdpr-rights", label: "GDPR Data Protection Rights" },
  { id: "children-privacy", label: "Children's Information" },
  { id: "policy-changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

// Privacy Policy Sections
export const PRIVACY_SECTIONS = [
  {
    id: "information-collection",
    icon: "📋",
    title: "Information We Collect",
    content: [
      {
        type: "paragraph",
        text: "We collect information to provide better services to all our users. The types of information we collect include:",
      },
      {
        type: "list",
        title: "A. Personal Information You Provide to Us",
        items: [
          "Name",
          "Email address",
          "Phone number",
          "Educational background (e.g., University, GPA, Major)",
          "CV/Resume or Portfolio data",
        ],
      },
      {
        type: "paragraph",
        text: "When you register for an account, apply for a scholarship, or subscribe to our newsletter, we may ask for this personal information.",
      },
      {
        type: "list",
        title: "B. Log Files",
        items: [
          "Internet protocol (IP) addresses",
          "Browser type",
          "Internet Service Provider (ISP)",
          "Date and time stamp",
          "Referring/exit pages",
          "Number of clicks",
        ],
      },
      {
        type: "paragraph",
        text: "ScholarX follows a standard procedure of using log files. These files log visitors when they visit websites. This information is not linked to any personally identifiable information.",
      },
      {
        type: "list",
        title: "C. Cookies and Web Beacons",
        items: [
          "Store visitor preferences",
          "Track pages accessed or visited",
          "Optimize user experience",
          "Customize web page content based on browser type",
        ],
      },
      {
        type: "paragraph",
        text: "Like any other website, ScholarX uses \"cookies\". The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.",
      },
      {
        type: "list",
        title: "D. Google User Data",
        items: [
          "To provide seamless integration with Google services, ScholarX accesses specific Google user data via Google OAuth APIs.",
          "Data Accessed: We request access to Basic Profile Information (Name, email address, and profile picture).",
          "Data Usage: We use this data for Authentication (verifying identity) and Communication (sending updates).",
          "Limited Use Disclosure: ScholarX's use and transfer to any other app of information received from Google APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements. We do not use Google user data for serving advertisements, nor do we sell this data to third parties.",
        ],
      },
    ],
  },
  {
    id: "information-use",
    icon: "🎯",
    title: "How We Use Your Information",
    content: [
      {
        type: "paragraph",
        text: "We use the information we collect in various ways, including to:",
      },
      {
        type: "list",
        title: "Primary Uses",
        items: [
          "Provide, operate, and maintain our website",
          "Improve, personalize, and expand our website",
          "Understand and analyze how you use our website",
          "Develop new products, services, features, and functionality",
          "Communicate with you, either directly or through one of our partners, including for customer service, updates, and marketing purposes",
          "Send you emails (e.g., Scholarship alerts, newsletters)",
          "Find and prevent fraud",
        ],
      },
    ],
  },
  {
    id: "third-party",
    icon: "🔗",
    title: "Third-Party Privacy Policies",
    content: [
      {
        type: "paragraph",
        text: "ScholarX's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.",
      },
      {
        type: "paragraph",
        text: "It may include their practices and instructions about how to opt-out of certain options. You can choose to disable cookies through your individual browser options.",
      },
      {
        type: "paragraph",
        text: "To know more detailed information about cookie management with specific web browsers, it can be found at the browsers' respective websites.",
      },
    ],
  },
  {
    id: "gdpr-rights",
    icon: "⚖️",
    title: "GDPR Data Protection Rights",
    content: [
      {
        type: "paragraph",
        text: "For European Users: We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:",
      },
      {
        type: "list",
        title: "Your Rights Include",
        items: [
          "The right to access – You have the right to request copies of your personal data",
          "The right to rectification – You have the right to request that we correct any information you believe is inaccurate",
          "The right to erasure – You have the right to request that we erase your personal data, under certain conditions",
          "The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions",
          "The right to object to processing – You have the right to object to our processing of your personal data, under certain conditions",
        ],
      },
      {
        type: "paragraph",
        text: "If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.",
      },
    ],
  },
  {
    id: "children-privacy",
    icon: "👶",
    title: "Children's Information",
    content: [
      {
        type: "paragraph",
        text: "Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.",
      },
      {
        type: "paragraph",
        text: "ScholarX does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.",
      },
    ],
  },
  {
    id: "policy-changes",
    icon: "📝",
    title: "Changes to This Privacy Policy",
    content: [
      {
        type: "paragraph",
        text: "We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes.",
      },
      {
        type: "paragraph",
        text: "We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.",
      },
    ],
  },
  {
    id: "contact",
    icon: "📧",
    title: "Contact Us",
    content: [
      {
        type: "paragraph",
        text: "If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.",
      },
      {
        type: "contact",
        details: {
          email: CONTACT_INFO.email,
          subject: CONTACT_INFO.emailSubjects.privacyInquiry,
          address: COMPANY_INFO.name + " Support Team",
        },
      },
      {
        type: "paragraph",
        text: `By visiting this page on our website: ${CONTACT_INFO.website}${CONTACT_INFO.contactPageUrl}`,
      },
    ],
  },
];

// Animation Configuration
export const ANIMATION_TIMINGS = {
  stagger: 100, // ms between each section animation
  sectionDelay: 200, // ms delay before section animations start
  scrollThreshold: 0.1, // viewport percentage for scroll animations
  tocHighlightOffset: 100, // px offset for ToC active state
};

// Theme Colors (consistent with existing pages)
export const THEME_COLORS = {
  primary: "#3399CC",
  secondary: "#FF6633",
  lightBg: "#D6EBF5",
  darkText: "#0A1F29",
  grayText: "#555555",
  lightGray: "#808080",
  glassBg: "rgba(255, 255, 255, 0.85)",
};
