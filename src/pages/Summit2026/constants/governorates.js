/**
 * @fileoverview Complete list of Egyptian governorates for form dropdowns.
 * Sorted alphabetically for consistent UX.
 */

/**
 * @typedef {{ value: string, label: string, region: string }} GovernorateOption
 */

/** @type {readonly GovernorateOption[]} */
export const EGYPTIAN_GOVERNORATES = Object.freeze([
  { value: 'alexandria', label: 'Alexandria', region: 'Northern Egypt' },
  { value: 'aswan', label: 'Aswan', region: 'Upper Egypt' },
  { value: 'asyut', label: 'Asyut', region: 'Upper Egypt' },
  { value: 'beheira', label: 'Beheira', region: 'Lower Egypt' },
  { value: 'beni-suef', label: 'Beni Suef', region: 'Middle Egypt' },
  { value: 'cairo', label: 'Cairo', region: 'Capital' },
  { value: 'dakahlia', label: 'Dakahlia', region: 'Lower Egypt' },
  { value: 'damietta', label: 'Damietta', region: 'Lower Egypt' },
  { value: 'fayoum', label: 'Fayoum', region: 'Middle Egypt' },
  { value: 'gharbia', label: 'Gharbia', region: 'Lower Egypt' },
  { value: 'giza', label: 'Giza', region: 'Greater Cairo' },
  { value: 'ismailia', label: 'Ismailia', region: 'Canal Zone' },
  { value: 'kafr-el-sheikh', label: 'Kafr El Sheikh', region: 'Lower Egypt' },
  { value: 'luxor', label: 'Luxor', region: 'Upper Egypt' },
  { value: 'matruh', label: 'Matruh', region: 'Western Desert' },
  { value: 'minya', label: 'Minya', region: 'Middle Egypt' },
  { value: 'monufia', label: 'Monufia', region: 'Lower Egypt' },
  { value: 'new-valley', label: 'New Valley', region: 'Western Desert' },
  { value: 'north-sinai', label: 'North Sinai', region: 'Sinai' },
  { value: 'port-said', label: 'Port Said', region: 'Canal Zone' },
  { value: 'qalyubia', label: 'Qalyubia', region: 'Greater Cairo' },
  { value: 'qena', label: 'Qena', region: 'Upper Egypt' },
  { value: 'red-sea', label: 'Red Sea', region: 'Eastern Desert' },
  { value: 'sharqia', label: 'Sharqia', region: 'Lower Egypt' },
  { value: 'sohag', label: 'Sohag', region: 'Upper Egypt' },
  { value: 'south-sinai', label: 'South Sinai', region: 'Sinai' },
  { value: 'suez', label: 'Suez', region: 'Canal Zone' },
]);
