/**
 * @fileoverview Shared pure helpers for Summit registration branch drafts.
 * These helpers are intentionally framework-free so they can be unit tested
 * without React or browser state.
 */

export const PROFILE_FIELD_KEYS = Object.freeze({
  highSchool: ["highSchoolName", "highSchoolYear"],
  undergraduate: ["universityName", "major", "undergraduateYear"],
  graduate: ["universityName", "major"],
  professional: ["jobTitle", "yearsOfExperience"],
  other: ["profileDescription"],
});

export const PROFILE_TYPES = Object.freeze([
  "highSchool",
  "undergraduate",
  "graduate",
  "professional",
  "other",
]);

export const normalizeProfileType = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.trim().toLowerCase().replace(/[\s_-]+/g, "");

  switch (normalized) {
    case "highschool":
      return "highSchool";
    case "undergraduate":
      return "undergraduate";
    case "graduate":
    case "postgraduate":
      return "graduate";
    case "professional":
      return "professional";
    case "other":
      return "other";
    default:
      return "";
  }
};

export const createBranchDraftStore = () => ({
  highSchool: {},
  undergraduate: {},
  graduate: {},
  professional: {},
  other: {},
});

export const buildProfileDetails = (profileType, values = {}) => {
  switch (profileType) {
    case "highSchool":
      return {
        highSchoolName: values.highSchoolName?.trim(),
        highSchoolYear: values.highSchoolYear,
      };
    case "undergraduate":
      return {
        universityName: values.universityName?.trim(),
        major: values.major?.trim(),
        undergraduateYear: values.undergraduateYear,
      };
    case "graduate":
      return {
        universityName: values.universityName?.trim(),
        major: values.major?.trim(),
      };
    case "professional":
      return {
        jobTitle: values.jobTitle?.trim(),
        yearsOfExperience: Number(values.yearsOfExperience || 0),
      };
    case "other":
      return {
        profileDescription: values.profileDescription?.trim(),
      };
    default:
      return {};
  }
};

export const snapshotBranchDraft = (profileType, values = {}) => {
  const keys = PROFILE_FIELD_KEYS[profileType] || [];
  return keys.reduce((acc, key) => {
    const value = values[key];
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

export const hydrateBranchDraft = (branchDrafts, profileType) => {
  return { ...(branchDrafts?.[profileType] || {}) };
};

export const pruneActiveBranchPayload = ({
  profileType,
  values = {},
  branchDrafts,
  baseFields = [],
}) => {
  const profileDetails = buildProfileDetails(profileType, values);
  const payload = baseFields.reduce((acc, key) => {
    if (values[key] !== undefined) {
      acc[key] = values[key];
    }
    return acc;
  }, {});

  return {
    ...payload,
    profileType,
    profileDetails,
    branchDrafts: {
      ...(branchDrafts || createBranchDraftStore()),
      [profileType]: profileDetails,
    },
  };
};
