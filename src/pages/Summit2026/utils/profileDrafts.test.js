import { describe, it, expect } from "vitest";
import {
  createBranchDraftStore,
  snapshotBranchDraft,
  hydrateBranchDraft,
  buildProfileDetails,
  pruneActiveBranchPayload,
} from "./profileDrafts";

describe("Summit profile draft helpers", () => {
  it("persists branch drafts independently when switching types", () => {
    const branchDrafts = createBranchDraftStore();

    branchDrafts.highSchool = snapshotBranchDraft("highSchool", {
      highSchoolName: "  STEM High School  ",
      highSchoolYear: "grade-12",
      major: "should not persist",
    });

    branchDrafts.undergraduate = snapshotBranchDraft("undergraduate", {
      universityName: "Nile University",
      major: "Computer Science",
      undergraduateYear: "year-3",
    });

    expect(hydrateBranchDraft(branchDrafts, "highSchool")).toEqual({
      highSchoolName: "  STEM High School  ",
      highSchoolYear: "grade-12",
    });

    expect(hydrateBranchDraft(branchDrafts, "undergraduate")).toEqual({
      universityName: "Nile University",
      major: "Computer Science",
      undergraduateYear: "year-3",
    });
  });

  it("builds profileDetails for the active branch only", () => {
    expect(
      buildProfileDetails("professional", {
        jobTitle: "  Product Manager  ",
        yearsOfExperience: "6",
        universityName: "ignored",
      }),
    ).toEqual({
      jobTitle: "Product Manager",
      yearsOfExperience: 6,
    });
  });

  it("prunes inactive branch keys from the serialized payload", () => {
    const result = pruneActiveBranchPayload({
      profileType: "undergraduate",
      values: {
        fullName: "Summit Student",
        email: "student@example.com",
        universityName: "Nile University",
        major: "Computer Science",
        undergraduateYear: "year-3",
        highSchoolName: "Should be removed",
        jobTitle: "Should be removed",
        yearsOfExperience: 4,
      },
      branchDrafts: createBranchDraftStore(),
      baseFields: ["fullName", "email"],
    });

    expect(result.profileType).toBe("undergraduate");
    expect(result.profileDetails).toEqual({
      universityName: "Nile University",
      major: "Computer Science",
      undergraduateYear: "year-3",
    });
    expect(result.branchDrafts.undergraduate).toEqual({
      universityName: "Nile University",
      major: "Computer Science",
      undergraduateYear: "year-3",
    });
    expect(result.branchDrafts.highSchool).toEqual({});
    expect(result.fullName).toBe("Summit Student");
    expect(result.email).toBe("student@example.com");
    expect(result.highSchoolName).toBeUndefined();
    expect(result.jobTitle).toBeUndefined();
  });
});
