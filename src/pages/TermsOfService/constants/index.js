/**
 * Terms of Service Page Constants
 * Centralized configuration for all Terms of Service content
 * Following Single Responsibility Principle - content separated from presentation
 */

import { CONTACT_INFO, COMPANY_INFO } from "../../../utils/constants";

// Hero Section Content
export const TOS_HERO = {
  label: "Legal",
  title: "Terms of Service",
  subtitle: "Please read these terms carefully",
  lastUpdated: "February 5, 2026",
  description:
    "By accessing or using ScholarX, you agree to be bound by these Terms of Service. These terms govern your use of our platform, services, and educational content.",
};

// Table of Contents for quick navigation
export const TABLE_OF_CONTENTS = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "user-accounts", label: "User Accounts" },
  { id: "services", label: "Services Description" },
  { id: "google-data", label: "Google User Data" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "user-content", label: "User-Generated Content" },
  { id: "prohibited", label: "Prohibited Activities" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "termination", label: "Termination" },
  { id: "changes", label: "Changes to Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Us" },
];

// Terms of Service Sections
export const TOS_SECTIONS = [
  {
    id: "acceptance",
    icon: "✅",
    title: "Acceptance of Terms",
    content: [
      {
        type: "paragraph",
        text: 'Welcome to ScholarX. By accessing or using our website, mobile applications, or any other services provided by ScholarX (collectively, the "Services"), you agree to comply with and be bound by these Terms of Service.',
      },
      {
        type: "list",
        title: "By using our Services, you confirm that:",
        items: [
          "You are at least 13 years of age (or the minimum age required in your jurisdiction)",
          "You have the legal capacity to enter into a binding agreement",
          "You will comply with all applicable laws and regulations",
          "You have read and understood our Privacy Policy",
        ],
      },
      {
        type: "paragraph",
        text: "If you do not agree to these Terms of Service, you must not access or use our Services.",
      },
    ],
  },
  {
    id: "user-accounts",
    icon: "👤",
    title: "User Accounts & Responsibilities",
    content: [
      {
        type: "paragraph",
        text: "To access certain features of our Services, you may be required to create an account. You are responsible for maintaining the confidentiality of your account credentials.",
      },
      {
        type: "list",
        title: "Account Responsibilities",
        items: [
          "Provide accurate, current, and complete information during registration",
          "Maintain and promptly update your account information",
          "Keep your password secure and confidential",
          "Notify us immediately of any unauthorized access to your account",
          "Accept responsibility for all activities that occur under your account",
        ],
      },
      {
        type: "paragraph",
        text: "We reserve the right to suspend or terminate accounts that violate these Terms or engage in suspicious activity.",
      },
    ],
  },
  {
    id: "services",
    icon: "📚",
    title: "Services Description",
    content: [
      {
        type: "paragraph",
        text: "ScholarX provides an online educational platform offering courses, learning materials, certifications, and related educational services. Our platform connects learners with quality educational content.",
      },
      {
        type: "list",
        title: "Our Services include:",
        items: [
          "Access to online courses and educational content",
          "Interactive learning features and assessments",
          "Course completion certificates",
          "Progress tracking and personalized learning paths",
          "Communication tools for educational purposes",
        ],
      },
      {
        type: "paragraph",
        text: "Disclaimer: Certificates provided by ScholarX are for educational completion tracking only and do not represent official academic accreditation unless explicitly stated otherwise.",
      },
      {
        type: "paragraph",
        text: "We reserve the right to modify, suspend, or discontinue any part of our Services at any time with reasonable notice where possible.",
      },
    ],
  },
  {
    id: "google-data",
    icon: "🔐",
    title: "Google User Data Usage",
    content: [
      {
        type: "paragraph",
        text: "ScholarX integrates with Google services to provide seamless authentication and enhanced user experience. This section explains how we handle data obtained through Google APIs.",
      },
      {
        type: "list",
        title: "Google Data Access and Use",
        items: [
          "We access basic profile information (name, email, profile picture) through Google OAuth for authentication purposes",
          "Google user data is used solely for account creation, identity verification, and communication",
          "We do not sell, rent, or share your Google data with third parties for marketing purposes",
          "Google data is stored securely and handled in accordance with our Privacy Policy",
        ],
      },
      {
        type: "paragraph",
        text: "ScholarX's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements. We do not use Google user data for serving advertisements.",
      },
    ],
  },
  {
    id: "intellectual-property",
    icon: "©️",
    title: "Intellectual Property Rights",
    content: [
      {
        type: "paragraph",
        text: "All content, features, and functionality of ScholarX, including but not limited to courses, text, graphics, logos, and software, are owned by ScholarX or its content providers and are protected by intellectual property laws.",
      },
      {
        type: "list",
        title: "Your Obligations",
        items: [
          "You may not copy, modify, or distribute our content without explicit permission",
          "Course materials are for personal, non-commercial use only",
          "You may not reverse engineer, decompile, or attempt to extract source code",
          "Trademarks and service marks may not be used without authorization",
        ],
      },
      {
        type: "paragraph",
        text: "Content creators and instructors retain ownership of their original course materials, with ScholarX granted a license to display and distribute such content on our platform.",
      },
    ],
  },
  {
    id: "user-content",
    icon: "💬",
    title: "User-Generated Content",
    content: [
      {
        type: "paragraph",
        text: "Our Services may allow you to submit, post, or share content such as comments, reviews, and forum posts. You retain ownership of your content but grant ScholarX certain rights.",
      },
      {
        type: "list",
        title: "Content License Grant",
        items: [
          "You grant ScholarX a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content",
          "This license allows us to promote and improve our Services",
          "You represent that you have the rights to submit such content",
          "You agree not to submit content that infringes on third-party rights",
        ],
      },
      {
        type: "paragraph",
        text: "We reserve the right to remove any user content that violates these Terms or is otherwise objectionable.",
      },
    ],
  },
  {
    id: "prohibited",
    icon: "🚫",
    title: "Prohibited Activities",
    content: [
      {
        type: "paragraph",
        text: "To maintain a safe and productive learning environment, certain activities are strictly prohibited on ScholarX.",
      },
      {
        type: "list",
        title: "You agree NOT to:",
        items: [
          "Share account credentials or allow unauthorized access to your account",
          "Upload malicious code, viruses, or harmful content",
          "Harass, bully, or discriminate against other users",
          "Scrape, crawl, or use automated tools to access our Services",
          "Attempt to bypass security measures or access restricted areas",
          "Use our Services for any illegal or unauthorized purpose",
          "Interfere with the proper functioning of our platform",
          "Impersonate others or provide false information",
        ],
      },
      {
        type: "paragraph",
        text: "Violations may result in immediate account suspension or termination and may be reported to law enforcement authorities.",
      },
    ],
  },
  {
    id: "liability",
    icon: "⚖️",
    title: "Limitation of Liability",
    content: [
      {
        type: "paragraph",
        text: "To the maximum extent permitted by applicable law, ScholarX and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages.",
      },
      {
        type: "list",
        title: "Disclaimers",
        items: [
          'Services are provided "as is" without warranties of any kind',
          "We do not guarantee uninterrupted or error-free service",
          "Educational content is for informational purposes and does not constitute professional advice",
          "We are not responsible for third-party content or links",
          "Our total liability shall not exceed the amount paid for Services in the past 12 months",
        ],
      },
      {
        type: "paragraph",
        text: "Some jurisdictions do not allow certain limitations of liability, so some of the above limitations may not apply to you.",
      },
    ],
  },
  {
    id: "termination",
    icon: "🔒",
    title: "Termination",
    content: [
      {
        type: "paragraph",
        text: "Both you and ScholarX may terminate your account and access to Services at any time.",
      },
      {
        type: "list",
        title: "Termination Rights",
        items: [
          "You may delete your account at any time through your profile settings",
          "We may suspend or terminate accounts that violate these Terms",
          "We may terminate Services with reasonable notice for business reasons",
          "Upon termination, your right to access paid content may be revoked",
        ],
      },
      {
        type: "paragraph",
        text: "Provisions that by their nature should survive termination shall remain in effect, including intellectual property rights, disclaimers, and limitations of liability.",
      },
    ],
  },
  {
    id: "changes",
    icon: "📝",
    title: "Changes to These Terms",
    content: [
      {
        type: "paragraph",
        text: "We may update these Terms of Service from time to time to reflect changes in our Services, legal requirements, or business practices.",
      },
      {
        type: "list",
        title: "Notification of Changes",
        items: [
          'We will post the updated Terms on this page with a new "Last Updated" date',
          "Material changes will be communicated via email or prominent notice on our platform",
          "Continued use of Services after changes constitutes acceptance of updated Terms",
          "If you disagree with changes, you should stop using our Services",
        ],
      },
      {
        type: "paragraph",
        text: "We encourage you to review these Terms periodically to stay informed about your rights and obligations.",
      },
    ],
  },
  {
    id: "governing-law",
    icon: "⚖️",
    title: "Governing Law",
    content: [
      {
        type: "paragraph",
        text: "These Terms shall be governed and construed in accordance with the laws of Egypt, without regard to its conflict of law provisions.",
      },
      {
        type: "paragraph",
        text: "Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions will remain in effect.",
      },
      {
        type: "paragraph",
        text: "Any disputes arising out of or relating to these Terms or our Services shall be subject to the exclusive jurisdiction of the courts of Egypt.",
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
        text: "If you have any questions about these Terms, please contact us:",
      },
      {
        type: "contact",
        details: {
          email: CONTACT_INFO.email,
          subject: CONTACT_INFO.emailSubjects.termsInquiry,
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

// Animation Configuration (reuse from PrivacyPolicy for consistency)
export const ANIMATION_TIMINGS = {
  stagger: 100,
  sectionDelay: 200,
  scrollThreshold: 0.1,
  tocHighlightOffset: 100,
};
