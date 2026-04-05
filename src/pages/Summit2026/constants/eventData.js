/**
 * @fileoverview Static event data for Next Scholar Summit 2026.
 * Single source of truth for all event content — Open/Closed Principle:
 * adding new sections only requires updating this file, not components.
 */

/** @typedef {{ value: number, suffix: string, label: string, description: string }} StatItem */
/** @typedef {{ id: string, icon: string, title: string, description: string, color: string, gradient: string }} TrackItem */
/** @typedef {{ id: string, name: string, tagline: string, description: string, accentColor: string }} PartnerItem */
/** @typedef {{ name: string, region: string }} GovernorateItem */

/**
 * Core event metadata.
 * @readonly
 */
export const EVENT_META = Object.freeze({
  name: 'Next Scholar Summit 2026',
  tagline: 'From local ambition to global impact.',
  /** ISO 8601 date string — used by useCountdown hook */
  date: '2026-05-01T09:00:00+02:00',
  venue: 'Nile University, Giza, Egypt',
  organizers: ['ScholarX', 'EU Jeel Connect'],
  edition: '2026',
  totalGovernorates: 10,
});

/**
 * Summit statistics for the animated counter bar.
 * @type {readonly StatItem[]}
 */
export const SUMMIT_STATS = Object.freeze([
  {
    value: 1200,
    suffix: '+',
    label: 'Attendees',
    description: 'Top-tier students and graduates from across Egypt',
    icon: '👥',
  },
  {
    value: 70,
    suffix: '+',
    label: 'Speakers & Experts',
    description: 'International and local thought leaders',
    icon: '🎤',
  },
  {
    value: 8,
    suffix: '',
    label: 'Panel Discussions',
    description: 'Featuring international and local leaders',
    icon: '💬',
  },
  {
    value: 16,
    suffix: '',
    label: 'Practical Workshops',
    description: 'Focused on future-proof skills',
    icon: '🛠',
  },
]);

/**
 * Strategic tracks — each has a unique gradient for visual distinction.
 * @type {readonly TrackItem[]}
 */
export const SUMMIT_TRACKS = Object.freeze([
  {
    id: 'global-education',
    icon: '🌍',
    title: 'Global Education & Scholarships',
    description:
      'Learn the real admission strategy for international programs and fully funded scholarships from experts who already walked this path.',
    color: '#f5c518',
    gradient: 'linear-gradient(135deg, rgba(245,197,24,0.15), rgba(255,165,0,0.05))',
    borderColor: 'rgba(245,197,24,0.4)',
  },
  {
    id: 'skills-development',
    icon: '⚡',
    title: 'Skills Development',
    description:
      'Join practical workshops on personal branding, AI tools, and cybersecurity to build skills the global market demands.',
    color: '#4fc3f7',
    gradient: 'linear-gradient(135deg, rgba(79,195,247,0.15), rgba(0,87,248,0.05))',
    borderColor: 'rgba(79,195,247,0.4)',
  },
  {
    id: 'career-excellence',
    icon: '🚀',
    title: 'Career Excellence',
    description:
      'Connect directly with industry leaders and market experts through high-value networking to understand what employers want today.',
    color: '#ff8a65',
    gradient: 'linear-gradient(135deg, rgba(255,138,101,0.15), rgba(255,87,34,0.05))',
    borderColor: 'rgba(255,138,101,0.4)',
  },
  {
    id: 'innovation-impact',
    icon: '🌱',
    title: 'Innovation & Impact',
    description:
      'Explore green entrepreneurship and learn how to turn ideas into sustainable, youth-led projects with real-world impact.',
    color: '#69f0ae',
    gradient: 'linear-gradient(135deg, rgba(105,240,174,0.15), rgba(0,200,150,0.05))',
    borderColor: 'rgba(105,240,174,0.4)',
  },
]);

/**
 * Strategic partners data.
 * @type {readonly PartnerItem[]}
 */
export const SUMMIT_PARTNERS = Object.freeze([
  {
    id: 'scholarx',
    name: 'ScholarX',
    tagline: "Egypt's leading platform for youth empowerment",
    description:
      "ScholarX empowers youth with educational opportunities, skill development, and practical pathways to global growth.",
    accentColor: '#f5c518',
    website: 'https://scholarx.net',
  },
  {
    id: 'eu-jeel-connect',
    name: 'EU Jeel Connect',
    tagline: 'Connecting youth in the Southern Neighbourhood to global opportunities',
    description:
      'A European Union initiative that links young people in the Southern Neighbourhood with global opportunities, collaboration, and knowledge exchange.',
    accentColor: '#003da5',
    website: '#',
  },
]);

/**
 * The 10 governorates reached during the pre-summit tour.
 * @type {readonly GovernorateItem[]}
 */
export const TOUR_GOVERNORATES = Object.freeze([
  { name: 'Cairo', region: 'Capital', students: '320+' },
  { name: 'Alexandria', region: 'North Coast', students: '280+' },
  { name: 'Giza', region: 'Greater Cairo', students: '250+' },
  { name: 'Minya', region: 'Middle Egypt', students: '180+' },
  { name: 'Asyut', region: 'Upper Egypt', students: '175+' },
  { name: 'Fayoum', region: 'Middle Egypt', students: '160+' },
  { name: 'Sohag', region: 'Upper Egypt', students: '155+' },
  { name: 'Qena', region: 'Upper Egypt', students: '140+' },
  { name: 'Luxor', region: 'Upper Egypt', students: '130+' },
  { name: 'Aswan', region: 'Upper Egypt', students: '120+' },
]);

/**
 * Pre-summit roundtable metadata.
 * @readonly
 */
export const ROUNDTABLE_DATA = Object.freeze({
  title: 'High-Level Roundtable Discussion',
  subtitle:
    'Democratizing Access to International Scholarships and Opportunities for Youth in Underserved Areas',
  description:
    'This exclusive session brings together policymakers, diplomats, and international organization leaders to move from identifying "access gaps" to co-creating Scalable Collaboration Models.',
  highlights: [
    { icon: '🏛️', text: 'Policymakers & Diplomats' },
    { icon: '🌐', text: 'International Organization Leaders' },
    { icon: '📊', text: 'Data-Driven Policy Recommendations' },
    { icon: '🤝', text: 'Scalable Collaboration Models' },
  ],
  keyHighlight:
    'The outcomes, data-driven insights, and policy recommendations from this Roundtable will be officially announced and presented during the Next Scholar Summit — making the summit a platform for real change and national-level impact.',
});
